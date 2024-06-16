import React, { useState, useEffect } from 'react';
import { ApolloProvider } from '@apollo/client';
import Provider from '../api/Provider';
import Login from '../components/Login';
import CharactersList from '../components/CharactersList';
import '../styles/App.css';

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

  const handleToggleFavorite = id => {
    let updatedFavorites;
    if (favorites.includes(id)) {
      updatedFavorites = favorites.filter(favId => favId !== id);
    } else {
      updatedFavorites = [...favorites, id];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem(
      'user',
      JSON.stringify({ ...user, favoriteCharacters: updatedFavorites })
    );
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Provider>
      <div className="App">
        <header className="navbar">
          <img src="/Rick_and_Morty.svg" alt="rick and morty logo" />
          <div>
            <button onClick={() => setDisplayFavorites(!displayFavorites)}>
              {displayFavorites
                ? 'Show All Characters'
                : 'Show favorite characters'}
            </button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <CharactersList
          onToggleFavorite={handleToggleFavorite}
          favorites={favorites}
          displayFavorites={displayFavorites}
        />
      </div>
    </Provider>
  );
};

export default App;
