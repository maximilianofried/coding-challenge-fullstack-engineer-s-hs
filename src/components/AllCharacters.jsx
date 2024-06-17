import React, { useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
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

const GET_USER_FAVORITES = gql`
  query GetUserFavorites($username: String!) {
    getUser(username: $username) {
      favoriteCharacters
    }
  }
`;

const TOGGLE_FAVORITE_CHARACTER = gql`
  mutation ToggleFavoriteCharacter($username: String!, $characterId: String!) {
    toggleFavoriteCharacter(username: $username, characterId: $characterId)
  }
`;

const AllCharacters = ({ user, refresh }) => {
  const [favorites, setFavorites] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { loading, error, data, refetch } = useQuery(GET_CHARACTERS, {
    variables: { page: currentPage },
  });

  const { data: userFavoritesData, refetch: refetchUserFavorites } = useQuery(
    GET_USER_FAVORITES,
    {
      variables: { username: user.username },
    }
  );

  const [toggleFavorite] = useMutation(TOGGLE_FAVORITE_CHARACTER);

  useEffect(() => {
    if (userFavoritesData) {
      setFavorites(userFavoritesData.getUser.favoriteCharacters);
    }
  }, [userFavoritesData]);

  useEffect(() => {
    refetchUserFavorites();
  }, [refresh, refetchUserFavorites]);

  const handleExpand = id => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handlePageChange = page => {
    setCurrentPage(page);
    refetch({ page });
  };

  const handleToggleFavorite = async id => {
    await toggleFavorite({
      variables: { username: user.username, characterId: id },
    });
    refetchUserFavorites();
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
