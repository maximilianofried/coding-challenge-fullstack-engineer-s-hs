import React from 'react';
import { useQuery, gql } from '@apollo/client';

import './PickleRick.css';

const QUERY_FOR_CHARACTERS = gql`
  query GetCharacters($page: Int!) {
    getCharacters(page: $page) {
      id
      name
      image
    }
  }
`;

const PickleRick = () => {
  const { loading, error, data } = useQuery(QUERY_FOR_CHARACTERS, {
    variables: { page: 1 },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const { getCharacters: characters } = data;

  if (!characters || characters.length === 0)
    return <p>No characters found.</p>;

  return (
    <div className="PickleRick">
      <div className="container">
        {characters.map(character => (
          <div key={character.id} className="character-card">
            <img
              className="avatar"
              src={character.image}
              alt={character.name}
            />
            <h2 className="name">{character.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PickleRick;
