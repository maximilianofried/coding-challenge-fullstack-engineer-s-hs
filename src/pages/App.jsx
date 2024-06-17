import React, { useState, useEffect } from 'react';
import { ApolloProvider, useMutation, gql, useQuery } from '@apollo/client';
import Provider from '../api/Provider';
import Login from '../components/Login';
import AllCharacters from '../components/AllCharacters';
import FavoriteCharacters from '../components/FavoriteCharacters';
import '../styles/App.css';
import Navbar from '../components/Navbar';

const TOGGLE_FAVORITE_CHARACTER = gql`
  mutation ToggleFavoriteCharacter($username: String!, $characterId: String!) {
    toggleFavoriteCharacter(username: $username, characterId: $characterId)
  }
`;

const GET_FAVORITE_CHARACTERS = gql`
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

const App = () => {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [displayFavorites, setDisplayFavorites] = useState(false);

  const [toggleFavorite] = useMutation(TOGGLE_FAVORITE_CHARACTER);

  const { data: favoriteData, refetch: refetchFavorites } = useQuery(
    GET_FAVORITE_CHARACTERS,
    {
      variables: { username: user ? user.username : '' },
      skip: !user, // Skip this query if user is not logged in
    }
  );

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  useEffect(() => {
    if (user) {
      refetchFavorites();
    }
  }, [user, refetchFavorites]);

  useEffect(() => {
    if (favoriteData && favoriteData.getFavoriteCharacters) {
      setFavorites(favoriteData.getFavoriteCharacters.map(char => char.id));
    }
  }, [favoriteData]);

  const handleLogin = userData => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    refetchFavorites();
  };

  const handleLogout = () => {
    setUser(null);
    setFavorites([]);
    localStorage.removeItem('user');
  };

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
    refetchFavorites();
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Provider>
      <div className="App">
        <Navbar
          displayFavorites={displayFavorites}
          setDisplayFavorites={setDisplayFavorites}
          handleLogout={handleLogout}
          user={user}
        />
        {displayFavorites ? (
          <FavoriteCharacters
            favorites={favorites}
            setFavorites={setFavorites}
            user={user}
            handleToggleFavorite={handleToggleFavorite}
          />
        ) : (
          <AllCharacters
            favorites={favorites}
            handleToggleFavorite={handleToggleFavorite}
            user={user}
          />
        )}
      </div>
    </Provider>
  );
};

export default App;
