import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useSearchParams } from 'react-router-dom';
import CharacterCard from './CharacterCard';
import {
  GET_CHARACTERS,
  GET_FAVORITE_CHARACTERS,
  GET_USER_FAVORITES,
  TOGGLE_FAVORITE_CHARACTER,
} from '../api/queries';
import '../styles/CharacterList.css';

/**
 * CharactersList component to display a list of characters.
 * @param {Object} user - The current logged-in user object.
 * @param {boolean} refresh - A flag to trigger a refresh of the character list.
 * @param {string} type - The type of characters to display ('all' or 'favorites').
 */
const CharactersList = ({ user, refresh, type }) => {
  // State to manage favorite characters
  const [favorites, setFavorites] = useState([]);

  // State to manage the expanded character card
  const [expandedId, setExpandedId] = useState(null);

  // Hook to manage search parameters in the URL
  const [searchParams, setSearchParams] = useSearchParams();

  // Determine the current page from the URL, defaulting to 1
  const currentPage = parseInt(searchParams.get('page')) || 1;

  // Check if the current page is the favorites page
  const isFavoritesPage = type === 'favorites';

  // Determine the appropriate query based on the page type
  const query = isFavoritesPage ? GET_FAVORITE_CHARACTERS : GET_CHARACTERS;
  const queryVariables = isFavoritesPage
    ? { username: user.username, page: currentPage }
    : { page: currentPage };

  // Execute the appropriate query
  const { loading, error, data, refetch } = useQuery(query, {
    variables: queryVariables,
  });

  // Query to fetch user favorites, skipped if on the favorites page
  const { data: userFavoritesData, refetch: refetchUserFavorites } = useQuery(
    GET_USER_FAVORITES,
    {
      variables: { username: user.username },
      skip: isFavoritesPage,
    }
  );

  // Mutation to toggle favorite status of a character
  const [toggleFavorite] = useMutation(TOGGLE_FAVORITE_CHARACTER);

  // Effect to update favorites when userFavoritesData changes
  useEffect(() => {
    if (userFavoritesData && userFavoritesData.getUser) {
      setFavorites(userFavoritesData.getUser.favoriteCharacters);
    }
  }, [userFavoritesData]);

  // Effect to refetch data when refresh or page type changes
  useEffect(() => {
    if (isFavoritesPage) {
      refetch();
    } else {
      refetchUserFavorites();
    }
  }, [refresh, refetch, refetchUserFavorites, isFavoritesPage]);

  // Effect to update favorites state when data changes on favorites page
  useEffect(() => {
    if (isFavoritesPage && data && data.getFavoriteCharacters) {
      setFavorites(data.getFavoriteCharacters.results.map(char => char.id));
    }
  }, [data, isFavoritesPage]);

  /**
   * Handle expanding or collapsing a character card.
   * @param {string} id - The ID of the character to expand/collapse.
   */
  const handleExpand = id => {
    setExpandedId(expandedId === id ? null : id);
  };

  /**
   * Handle page change for pagination.
   * @param {number} page - The page number to navigate to.
   */
  const handlePageChange = page => {
    setSearchParams({ page });
    refetch({ ...queryVariables, page });
  };

  /**
   * Handle toggling favorite status of a character.
   * @param {string} id - The ID of the character to toggle.
   */
  const handleToggleFavorite = async id => {
    await toggleFavorite({
      variables: { username: user.username, characterId: id },
    });
    if (isFavoritesPage) {
      refetch();
    } else {
      refetchUserFavorites();
    }
  };

  // Display loading state
  if (loading) return <p>Loading...</p>;

  // Display error state
  if (error) return <p>Error :( {error.message}</p>;

  // Extract pagination info and character list from the data
  const info = isFavoritesPage
    ? data.getFavoriteCharacters.info
    : data.getCharacters.info;
  const charactersList = isFavoritesPage
    ? data.getFavoriteCharacters.results
    : data.getCharacters.results;
  const totalPages = info.pages;

  return (
    <div className="characters-list">
      {charactersList.length === 0 ? (
        <div>
          <p>
            {isFavoritesPage
              ? "No favorites yet? It's like Rick without a portal gun!"
              : 'No characters found!'}
          </p>
          {isFavoritesPage && (
            <img
              className="fallback-image"
              src="./rick.png"
              alt="rick and morty"
            />
          )}
        </div>
      ) : (
        <ul className="character-cards">
          {charactersList.map(character => (
            <li key={character.id}>
              <CharacterCard
                character={character}
                onExpand={handleExpand}
                expanded={expandedId === character.id}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={favorites.includes(character.id)}
              />
            </li>
          ))}
        </ul>
      )}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            onClick={() => handlePageChange(info.prev)}
            disabled={!info.prev}
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(info.next)}
            disabled={!info.next}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CharactersList;
