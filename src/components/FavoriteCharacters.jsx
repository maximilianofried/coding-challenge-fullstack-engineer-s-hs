import React, { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import CharacterCard from './CharacterCard';
import '../styles/CharacterList.css';

const GET_FAVORITE_CHARACTERS = gql`
  query GetFavoriteCharacters($username: String!, $page: Int!) {
    getFavoriteCharacters(username: $username, page: $page) {
      info {
        count
        pages
        next
        prev
      }
      results {
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

  const { loading, error, data } = useQuery(GET_FAVORITE_CHARACTERS, {
    variables: { username: user.username, page: currentPage },
  });

  useEffect(() => {
    if (data) {
      setFavorites(data.getFavoriteCharacters.results.map(char => char.id));
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

  const { info, results: charactersToDisplay } = data.getFavoriteCharacters;
  const totalPages = info.pages;

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
      <div>{`Total Pages: ${totalPages}, Current Page: ${currentPage}`}</div>
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

export default FavoriteCharacters;
