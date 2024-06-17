import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Provider from '../api/Provider';
import Login from '../components/Login';
import AllCharacters from '../components/AllCharacters';
import FavoriteCharacters from '../components/FavoriteCharacters';
import Navbar from '../components/Navbar';
import '../styles/App.css';

const App = () => {
  const [user, setUser] = useState(null);
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
    setRefresh(!refresh);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Provider>
      <Router>
        <div className="App">
          <Navbar
            setDisplayFavorites={handleDisplayFavoritesToggle}
            handleLogout={handleLogout}
            user={user}
          />
          <Routes>
            <Route path="/" element={<Navigate to="/characters" />} />
            <Route
              path="/characters"
              element={<AllCharacters user={user} refresh={refresh} />}
            />
            <Route
              path="/favorites"
              element={<FavoriteCharacters user={user} refresh={refresh} />}
            />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
