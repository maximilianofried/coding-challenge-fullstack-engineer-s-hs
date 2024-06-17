import React, { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import CharacterCard from './CharacterCard';
import '../styles/CharacterList.css';

const GET_FAVORITE_CHARACTERS = gql`
  query GetFavoriteCharacters($username: String!, $page: Int!) {
    getFavoriteCharacters(username: $username, page: $page) {
      id
      name
      image
      species
      gender
      origin {
        name
        dimension
      }
      status
      episode {
        id
      }
    }
  }
`;

const FavoriteCharacters = ({
  favorites,
  setFavorites,
  user,
  handleToggleFavorite,
}) => {
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { loading, error, data, refetch } = useQuery(GET_FAVORITE_CHARACTERS, {
    variables: { username: user.username, page: currentPage },
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (data) {
      setFavorites(data.getFavoriteCharacters.map(char => char.id));
    }
  }, [data, setFavorites]);

  const handleExpand = id => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  const handleToggleFavoriteAndUpdate = async id => {
    await handleToggleFavorite(id);
    setFavorites(prevFavorites => {
      const updatedFavorites = prevFavorites.filter(favId => favId !== id);
      return updatedFavorites;
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( {error.message}</p>;

  const charactersToDisplay = data
    ? data.getFavoriteCharacters.filter(char => favorites.includes(char.id))
    : [];

  const totalPages = Math.ceil(charactersToDisplay.length / itemsPerPage);

  return (
    <div className="characters-list">
      {charactersToDisplay.length === 0 ? (
        <div>
          <p>No favorites yet? It's like Rick without a portal gun!</p>
          <img
            className="fallback-image"
            src="./rick.png"
            alt="rick and morty"
          />
        </div>
      ) : (
        <ul className="character-cards">
          {charactersToDisplay.map(character => (
            <li key={character.id}>
              <CharacterCard
                character={character}
                onExpand={handleExpand}
                expanded={expandedId === character.id}
                onToggleFavorite={handleToggleFavoriteAndUpdate}
                isFavorite={favorites.includes(character.id)}
              />
            </li>
          ))}
        </ul>
      )}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={charactersToDisplay.length < itemsPerPage}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default FavoriteCharacters;
