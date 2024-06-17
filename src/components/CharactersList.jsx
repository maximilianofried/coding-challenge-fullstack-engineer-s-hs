import React, { useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
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

export const GET_FAVORITE_CHARACTERS = gql`
  query GetFavoriteCharacters($username: String!) {
    getFavoriteCharacters(username: $username) {
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

export const TOGGLE_FAVORITE_CHARACTER = gql`
  mutation ToggleFavoriteCharacter($username: String!, $characterId: String!) {
    toggleFavoriteCharacter(username: $username, characterId: $characterId)
  }
`;

const CharactersList = ({
  favorites,
  setFavorites,
  displayFavorites,
  user,
}) => {
  const [characters, setCharacters] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const { loading, error, data } = useQuery(GET_CHARACTERS, {
    variables: { page: 1 },
  });

  const { data: favoriteData } = useQuery(GET_FAVORITE_CHARACTERS, {
    variables: { username: user.username },
  });

  const [toggleFavorite] = useMutation(TOGGLE_FAVORITE_CHARACTER);

  useEffect(() => {
    if (data) {
      setCharacters(data.getCharacters);
    }
  }, [data]);

  useEffect(() => {
    if (favoriteData) {
      setFavorites(favoriteData.getFavoriteCharacters.map(char => char.id));
    }
  }, [favoriteData, setFavorites]);

  const handleToggleFavorite = async id => {
    let updatedFavorites;
    if (favorites.includes(id)) {
      updatedFavorites = favorites.filter(favId => favId !== id);
    } else {
      updatedFavorites = [...favorites, id];
    }
    setFavorites(updatedFavorites);

    await toggleFavorite({
      variables: { username: user.username, characterId: id },
    });
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
    </div>
  );
};

export default CharactersList;
