import React, { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import CharacterCard from './CharacterCard';
import '../styles/CharacterList.css';

const GET_CHARACTERS = gql`
  query GetCharacters($page: Int!) {
    getCharacters(page: $page) {
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

const AllCharacters = ({ favorites, handleToggleFavorite }) => {
  const [characters, setCharacters] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { loading, error, data } = useQuery(GET_CHARACTERS, {
    variables: { page: currentPage },
  });

  useEffect(() => {
    if (data) {
      setCharacters(data.getCharacters.results);
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

  const { info, results: charactersList } = data.getCharacters;
  const totalPages = info.pages;

  return (
    <div className="characters-list">
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

export default AllCharacters;
