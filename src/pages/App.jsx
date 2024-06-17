import React, { useState, useEffect } from 'react';
import Provider from '../api/Provider';
import Login from '../components/Login';
import AllCharacters from '../components/AllCharacters';
import FavoriteCharacters from '../components/FavoriteCharacters';
import Navbar from '../components/Navbar';
import '../styles/App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [displayFavorites, setDisplayFavorites] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  const handleLogin = userData => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const handleDisplayFavoritesToggle = () => {
    setDisplayFavorites(!displayFavorites);
    setRefresh(!refresh);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Provider>
      <div className="App">
        <Navbar
          displayFavorites={displayFavorites}
          setDisplayFavorites={handleDisplayFavoritesToggle}
          handleLogout={handleLogout}
          user={user}
        />
        {displayFavorites ? (
          <FavoriteCharacters user={user} refresh={refresh} />
        ) : (
          <AllCharacters user={user} refresh={refresh} />
        )}
      </div>
    </Provider>
  );
};

export default App;
