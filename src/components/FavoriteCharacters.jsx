import React, { useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useSearchParams } from 'react-router-dom';
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

const TOGGLE_FAVORITE_CHARACTER = gql`
  mutation ToggleFavoriteCharacter($username: String!, $characterId: String!) {
    toggleFavoriteCharacter(username: $username, characterId: $characterId)
  }
`;

const FavoriteCharacters = ({ user, refresh }) => {
  const [favorites, setFavorites] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get('page')) || 1;

  const { loading, error, data, refetch } = useQuery(GET_FAVORITE_CHARACTERS, {
    variables: { username: user.username, page: currentPage },
  });

  const [toggleFavorite] = useMutation(TOGGLE_FAVORITE_CHARACTER);

  useEffect(() => {
    if (data) {
      setFavorites(data.getFavoriteCharacters.results.map(char => char.id));
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [refresh, refetch]);

  const handleExpand = id => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handlePageChange = page => {
    setSearchParams({ page });
    refetch({ username: user.username, page });
  };

  const handleToggleFavorite = async id => {
    await toggleFavorite({
      variables: { username: user.username, characterId: id },
    });
    refetch();
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

export default FavoriteCharacters;
