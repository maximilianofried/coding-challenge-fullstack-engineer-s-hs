import React, { useState, useEffect } from 'react';
import { ApolloProvider, useMutation, useQuery, gql } from '@apollo/client';
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

const GET_USER_FAVORITES = gql`
  query GetUserFavorites($username: String!) {
    getUser(username: $username) {
      favoriteCharacters
    }
  }
`;

const App = () => {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [displayFavorites, setDisplayFavorites] = useState(false);

  const [toggleFavorite] = useMutation(TOGGLE_FAVORITE_CHARACTER);
  const { data: userFavoritesData, refetch: refetchUserFavorites } = useQuery(
    GET_USER_FAVORITES,
    {
      variables: { username: user ? user.username : '' },
      skip: !user,
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
    if (user && userFavoritesData) {
      setFavorites(userFavoritesData.getUser.favoriteCharacters);
    }
  }, [user, userFavoritesData]);

  const handleLogin = userData => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    refetchUserFavorites();
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
    refetchUserFavorites();
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
