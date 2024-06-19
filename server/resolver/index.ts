import { IResolvers } from '@graphql-tools/utils';
import { GraphQLError } from 'graphql';
import axios from 'axios';
import User from '../models/User';
import Character, { ICharacter } from '../models/Character';
import Metadata from '../models/Metadata';

// Define types based on API documentation
interface Location {
  name: string;
  dimension?: string;
}

interface Episode {
  id: string;
  name: string;
  air_date: string;
}

interface ApiCharacter {
  id: string;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: Location;
  location: Location;
  image: string;
  episode: string[];
  created: string;
}

interface ApiResponse {
  info: {
    count: number;
    pages: number;
    next: string;
    prev: string;
  };
  results: ApiCharacter[];
}

// Define the expiration time for cached characters (24 hours)
const EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Fetches and saves characters from the API to the database.
 * @param {number} page - The page number to fetch.
 * @returns {Promise<ICharacter[]>} - The fetched characters.
 */
const fetchAndSaveCharacters = async (page: number): Promise<ICharacter[]> => {
  try {
    const response = await axios.get<ApiResponse | { error: string }>(
      `https://rickandmortyapi.com/api/character?page=${page}`
    );

    // Check if the response contains an error
    if ('error' in response.data) {
      console.log('API error:', response.data.error);
      return [];
    }

    const data = response.data as ApiResponse;
    const characters = data.results.map((char: ApiCharacter) => ({
      id: char.id,
      name: char.name,
      image: char.image,
      species: char.species,
      gender: char.gender,
      origin: {
        name: char.origin.name,
        dimension: char.origin.dimension || '',
      },
      status: char.status,
      episode: char.episode.map(ep => ({
        id: ep,
        name: '',
        air_date: '',
      })),
      lastUpdated: new Date(),
      page: page,
    }));

    await Character.deleteMany({
      id: { $in: characters.map(char => char.id) },
    });
    await Character.insertMany(characters as ICharacter[]);

    // Update metadata with the latest total character count and total pages
    await Metadata.updateOne(
      { key: 'characterInfo' },
      {
        value: {
          count: data.info.count,
          pages: data.info.pages,
        },
      },
      { upsert: true }
    );

    return Character.find({
      id: { $in: characters.map(char => char.id) },
    }).exec();
  } catch (error) {
    console.error('Error fetching and saving characters:', error);
    return [];
  }
};

/**
 * Fetches episodes by their IDs.
 * @param {string[]} ids - The IDs of the episodes to fetch.
 * @returns {Promise<Episode[]>} - The fetched episodes.
 */
const fetchEpisodesByIds = async (ids: string[]): Promise<Episode[]> => {
  const episodePromises = ids.map(id => axios.get(id));
  const episodeResponses = await Promise.all(episodePromises);
  return episodeResponses.map(response => response.data);
};

const resolvers: IResolvers = {
  Query: {
    /**
     * Fetches a user by username.
     * @param {any} _ - Unused "parent" parameter.
     * @param {Object} args - The arguments object.
     * @param {string} args.username - The username of the user to fetch.
     * @returns {Promise<User>} - The fetched user.
     * @throws {GraphQLError} - If the user is not found.
     */
    getUser: async (_: any, { username }: { username: string }) => {
      const user = await User.findOne({ username });
      if (!user)
        throw new GraphQLError('User not found', {
          extensions: { code: 'USER_NOT_FOUND' },
        });
      return user;
    },

    /**
     * Fetches a paginated list of characters.
     * @param {any} _ - Unused "parent" parameter.
     * @param {Object} args - The arguments object.
     * @param {number} args.page - The page number to fetch.
     * @returns {Promise<Object>} - The paginated list of characters.
     */
    getCharacters: async (_: any, { page = 1 }: { page: number }) => {
      let characters = (await Character.find({ page }).exec()) as ICharacter[];
      const now = Date.now();
      let totalCharacters = 0;
      let totalPages = 0;

      // Check if metadata exists
      const metadata = await Metadata.findOne({ key: 'characterInfo' });
      if (metadata) {
        totalCharacters = metadata.value.count;
        totalPages = metadata.value.pages;
      }

      // Fetch from API if characters are not in the database or are expired
      if (
        !characters.length ||
        now - characters[0].lastUpdated.getTime() > EXPIRATION_TIME
      ) {
        characters = await fetchAndSaveCharacters(page);
        // Fetch updated metadata after saving new characters
        const updatedMetadata = await Metadata.findOne({
          key: 'characterInfo',
        });
        if (updatedMetadata) {
          totalCharacters = updatedMetadata.value.count;
          totalPages = updatedMetadata.value.pages;
        }
      }

      return {
        info: {
          count: totalCharacters,
          pages: totalPages,
          next: page < totalPages ? page + 1 : null,
          prev: page > 1 ? page - 1 : null,
        },
        results: characters,
      };
    },

    /**
     * Fetches episodes by their IDs.
     * @param {any} _ - Unused "parent" parameter.
     * @param {Object} args - The arguments object.
     * @param {string[]} args.ids - The IDs of the episodes to fetch.
     * @returns {Promise<Episode[]>} - The fetched episodes.
     */
    getEpisodesByIds: async (_: any, { ids }: { ids: string[] }) => {
      const episodes = await fetchEpisodesByIds(ids);
      return episodes
        .sort(
          (a, b) =>
            new Date(b.air_date).getTime() - new Date(a.air_date).getTime()
        )
        .slice(0, 3);
    },

    /**
     * Fetches a paginated list of favorite characters for a user.
     * @param {any} _ - Unused "parent" parameter.
     * @param {Object} args - The arguments object.
     * @param {string} args.username - The username of the user.
     * @param {number} args.page - The page number to fetch.
     * @returns {Promise<Object>} - The paginated list of favorite characters.
     * @throws {GraphQLError} - If the user is not found.
     */
    getFavoriteCharacters: async (_, { username, page = 1 }) => {
      const user = await User.findOne({ username }).exec();
      if (!user)
        throw new GraphQLError('User not found', {
          extensions: { code: 'USER_NOT_FOUND' },
        });

      const itemsPerPage = 20; // Define items per page
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = page * itemsPerPage;

      const reversedFavoriteCharacterIds = [
        ...user.favoriteCharacters,
      ].reverse();
      const favoriteCharacterIds = reversedFavoriteCharacterIds.slice(
        startIndex,
        endIndex
      );
      const favoriteCharacters = await Character.find({
        id: { $in: favoriteCharacterIds },
      }).exec();

      const totalFavorites = user.favoriteCharacters.length;
      const totalPages = Math.ceil(totalFavorites / itemsPerPage);

      const sortedFavoriteCharacters = favoriteCharacterIds.map(id =>
        favoriteCharacters.find(character => character.id === id)
      );

      return {
        info: {
          count: totalFavorites,
          pages: totalPages,
          next: page < totalPages ? page + 1 : null,
          prev: page > 1 ? page - 1 : null,
        },
        results: sortedFavoriteCharacters,
      };
    },
  },
  Mutation: {
    /**
     * Logs in a user by creating a new user if they do not exist.
     * @param {any} _ - Unused "parent" parameter.
     * @param {Object} args - The arguments object.
     * @param {string} args.username - The username of the user.
     * @returns {Promise<User>} - The logged-in user.
     */
    login: async (_: any, { username }: { username: string }) => {
      let user = await User.findOne({ username });
      if (!user) {
        user = new User({ username });
        await user.save();
      }
      return user;
    },

    /**
     * Toggles the favorite status of a character for a user.
     * @param {any} _ - Unused "parent" parameter.
     * @param {Object} args - The arguments object.
     * @param {string} args.username - The username of the user.
     * @param {string} args.characterId - The ID of the character to toggle.
     * @returns {Promise<string[]>} - The updated list of favorite character IDs.
     * @throws {GraphQLError} - If the user is not found.
     */
    toggleFavoriteCharacter: async (_, { username, characterId }) => {
      const user = await User.findOne({ username }).exec();
      if (!user)
        throw new GraphQLError('User not found', {
          extensions: { code: 'USER_NOT_FOUND' },
        });

      if (user.favoriteCharacters.includes(characterId)) {
        user.favoriteCharacters = user.favoriteCharacters.filter(
          favChar => favChar !== characterId
        );
      } else {
        user.favoriteCharacters.push(characterId);
      }

      await user.save();
      return user.favoriteCharacters;
    },
  },
};

export default resolvers;
