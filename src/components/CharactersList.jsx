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
  const [characters, setCharacters] = useState([]); // Local state to store fetched characters
  const [expandedId, setExpandedId] = useState(null); // State to track expanded character card
  const [currentPage, setCurrentPage] = useState(1); // State to track the current page for pagination
  const [itemsPerPage] = useState(10); // Define items per page for pagination

  const { loading, error, data } = useQuery(GET_CHARACTERS, {
    variables: { page: currentPage }, // Use current page state for query
  });

  const { data: favoriteData } = useQuery(GET_FAVORITE_CHARACTERS, {
    variables: { username: user.username, page: currentPage }, // Fetch favorite characters for the current page
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

  useEffect(() => {
    // Reset page counter when displayFavorites changes
    setCurrentPage(1);
  }, [displayFavorites]);

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

  const handleExpand = id => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handlePageChange = page => {
    setCurrentPage(page); // Update current page state
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( {error.message}</p>;

  // Determine which characters to display based on the current view (all characters or favorites)
  const charactersToDisplay = displayFavorites
    ? characters.filter(character => favorites.includes(character.id)) // Filter characters to display based on updated favorites
    : data
      ? data.getCharacters
      : [];

  // Calculate total pages
  const totalPages = Math.ceil(charactersToDisplay.length / itemsPerPage);

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
      {totalPages > 1 && ( // Conditionally render pagination controls
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

export default CharactersList;
