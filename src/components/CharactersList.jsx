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

const CharactersList = ({ user, refresh, type }) => {
  const [favorites, setFavorites] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get('page')) || 1;

  const isFavoritesPage = type === 'favorites';

  const query = isFavoritesPage ? GET_FAVORITE_CHARACTERS : GET_CHARACTERS;
  const queryVariables = isFavoritesPage
    ? { username: user.username, page: currentPage }
    : { page: currentPage };

  const { loading, error, data, refetch } = useQuery(query, {
    variables: queryVariables,
  });

  const { data: userFavoritesData, refetch: refetchUserFavorites } = useQuery(
    GET_USER_FAVORITES,
    {
      variables: { username: user.username },
      skip: isFavoritesPage, // Skip this query if we're on the favorites page
    }
  );

  const [toggleFavorite] = useMutation(TOGGLE_FAVORITE_CHARACTER);

  useEffect(() => {
    if (userFavoritesData && userFavoritesData.getUser) {
      setFavorites(userFavoritesData.getUser.favoriteCharacters);
    }
  }, [userFavoritesData]);

  useEffect(() => {
    if (isFavoritesPage) {
      refetch();
    } else {
      refetchUserFavorites();
    }
  }, [refresh, refetch, refetchUserFavorites, isFavoritesPage]);

  useEffect(() => {
    if (isFavoritesPage && data && data.getFavoriteCharacters) {
      setFavorites(data.getFavoriteCharacters.results.map(char => char.id));
    }
  }, [data, isFavoritesPage]);

  const handleExpand = id => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handlePageChange = page => {
    setSearchParams({ page });
    refetch({ ...queryVariables, page });
  };

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( {error.message}</p>;

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
