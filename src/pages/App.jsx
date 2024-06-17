import React, { useState, useEffect } from 'react';
import { ApolloProvider } from '@apollo/client';
import Provider from '../api/Provider';
import Login from '../components/Login';
import CharactersList from '../components/CharactersList';
import '../styles/App.css';
import Navbar from '../components/Navbar';

const App = () => {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [displayFavorites, setDisplayFavorites] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFavorites(parsedUser.favoriteCharacters || []);
    }
  }, []);

  const handleLogin = userData => {
    setUser(userData);
    setFavorites(userData.favoriteCharacters || []);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setFavorites([]);
    localStorage.removeItem('user');
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
        <CharactersList
          favorites={favorites}
          setFavorites={setFavorites}
          displayFavorites={displayFavorites}
          user={user}
        />
      </div>
    </Provider>
  );
};

export default App;
