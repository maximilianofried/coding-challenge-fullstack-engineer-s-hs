import { IResolvers } from '@graphql-tools/utils';
import { GraphQLError } from 'graphql';
import axios from 'axios';
import User from '../models/User';
import Character, { ICharacter } from '../models/Character';

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

const EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours

const fetchAndSaveCharacters = async (page: number): Promise<ICharacter[]> => {
  const response = await axios.get<ApiResponse>(
    `https://rickandmortyapi.com/api/character?page=${page}`
  );
  const data = response.data;

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

  await Character.deleteMany({ id: { $in: characters.map(char => char.id) } });
  await Character.insertMany(characters as ICharacter[]);

  return Character.find({
    id: { $in: characters.map(char => char.id) },
  }).exec();
};

const fetchEpisodesByIds = async (ids: string[]): Promise<Episode[]> => {
  const episodePromises = ids.map(id => axios.get(id));
  const episodeResponses = await Promise.all(episodePromises);
  return episodeResponses.map(response => response.data);
};

const resolvers: IResolvers = {
  Query: {
    getUser: async (_: any, { username }: { username: string }) => {
      const user = await User.findOne({ username });
      if (!user)
        throw new GraphQLError('User not found', {
          extensions: { code: 'USER_NOT_FOUND' },
        });
      return user;
    },
    getCharacters: async (_: any, { page = 1 }: { page: number }) => {
      let characters = (await Character.find({ page }).exec()) as ICharacter[];

      const now = Date.now();
      if (
        !characters.length ||
        now - characters[0].lastUpdated.getTime() > EXPIRATION_TIME
      ) {
        characters = await fetchAndSaveCharacters(page);
      }

      return characters;
    },
    getEpisodesByIds: async (_: any, { ids }: { ids: string[] }) => {
      const episodes = await fetchEpisodesByIds(ids);
      return episodes
        .sort(
          (a, b) =>
            new Date(a.air_date).getTime() - new Date(b.air_date).getTime()
        )
        .slice(0, 3);
    },
  },
  Mutation: {
    login: async (_: any, { username }: { username: string }) => {
      let user = await User.findOne({ username });
      if (!user) {
        user = new User({ username });
        await user.save();
      }
      return user;
    },
    toggleFavoriteCharacter: async (
      _: any,
      { username, characterId }: { username: string; characterId: string }
    ) => {
      const user = await User.findOne({ username });
      if (!user)
        throw new GraphQLError('User not found', {
          extensions: { code: 'USER_NOT_FOUND' },
        });

      if (user.favoriteCharacters.includes(characterId)) {
        user.favoriteCharacters = user.favoriteCharacters.filter(
          id => id !== characterId
        );
      } else {
        user.favoriteCharacters.push(characterId);
      }

      await user.save();
      return user;
    },
  },
};

export default resolvers;
