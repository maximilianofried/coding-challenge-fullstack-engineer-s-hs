import React, { useState, useEffect, useRef, useCallback } from 'react';
import { gql, useQuery } from '@apollo/client';
import CharacterCard from './CharacterCard';
import '../styles/CharacterList.css';

const GET_CHARACTERS = gql`
  query GetCharacters($page: Int!) {
    getCharacters(page: $page) {
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

const CharactersList = ({
  favorites,
  setFavorites,
  displayFavorites,
  user,
}) => {
  const [page, setPage] = useState(1);
  const [characters, setCharacters] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const { loading, error, data, fetchMore } = useQuery(GET_CHARACTERS, {
    variables: { page: 1 },
  });

  useEffect(() => {
    if (data) {
      setCharacters(data.getCharacters);
    }
  }, [data]);

  const handleToggleFavorite = id => {
    let updatedFavorites;
    if (favorites.includes(id)) {
      updatedFavorites = favorites.filter(favId => favId !== id);
    } else {
      updatedFavorites = [...favorites, id];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem(
      'user',
      JSON.stringify({ ...user, favoriteCharacters: updatedFavorites })
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( {error.message}</p>;

  const charactersToDisplay = displayFavorites
    ? characters.filter(character => favorites.includes(character.id))
    : characters;

  const handleExpand = id => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="characters-list">
      {displayFavorites && favorites.length === 0 ? (
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
      {loadingMore && <p>Loading more characters...</p>}
    </div>
  );
};

export default CharactersList;
