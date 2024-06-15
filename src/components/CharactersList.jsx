import React, { useState } from 'react';
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

const CharactersList = ({ onToggleFavorite, favorites, displayFavorites }) => {
  const { loading, error, data } = useQuery(GET_CHARACTERS, {
    variables: { page: 1 },
  });
  console.log('CharactersList.js: data', data);
  const [expandedId, setExpandedId] = useState(null);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( {error.message}</p>;

  const charactersToDisplay = displayFavorites
    ? data.getCharacters.filter(character => favorites.includes(character.id))
    : data.getCharacters;

  const handleExpand = id => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="characters-list">
      {charactersToDisplay.map(character => (
        <CharacterCard
          key={character.id}
          character={character}
          onExpand={handleExpand}
          expanded={expandedId === character.id}
          onToggleFavorite={onToggleFavorite}
          isFavorite={favorites.includes(character.id)}
        />
      ))}
    </div>
  );
};

export default CharactersList;
