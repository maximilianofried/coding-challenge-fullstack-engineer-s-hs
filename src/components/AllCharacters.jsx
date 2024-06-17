import React, { useState, useEffect } from 'react';
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

const AllCharacters = ({ favorites, handleToggleFavorite }) => {
  const [characters, setCharacters] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { loading, error, data } = useQuery(GET_CHARACTERS, {
    variables: { page: currentPage },
  });

  useEffect(() => {
    if (data) {
      setCharacters(data.getCharacters);
    }
  }, [data]);

  const handleExpand = id => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( {error.message}</p>;

  const totalPages = Math.ceil(characters.length / itemsPerPage);

  return (
    <div className="characters-list">
      <ul className="character-cards">
        {characters.map(character => (
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
            disabled={characters.length < itemsPerPage}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllCharacters;
