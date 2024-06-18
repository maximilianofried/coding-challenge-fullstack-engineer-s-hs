import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Provider from '../api/Provider';
import Login from '../components/Login';
import CharactersList from '../components/CharactersList';
import Navbar from '../components/Navbar';
import '../styles/App.css';

/**
 * Main application component.
 * Manages user authentication and routing.
 */
const App = () => {
  // State to hold the current user
  const [user, setUser] = useState(null);

  // State to trigger a refresh of the character list
  const [refresh, setRefresh] = useState(false);

  // Effect to load the user from local storage when the component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  /**
   * Handles user login.
   * @param {Object} userData - User data from login.
   */
  const handleLogin = userData => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  /**
   * Handles user logout.
   */
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  /**
   * Toggles the refresh state to update the character list.
   */
  const handleDisplayFavoritesToggle = () => {
    setRefresh(!refresh);
  };

  // If no user is logged in, render the login component
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Provider>
      <Router>
        <div className="App">
          {/* Navbar with user info and logout functionality */}
          <Navbar
            setDisplayFavorites={handleDisplayFavoritesToggle}
            handleLogout={handleLogout}
            user={user}
          />
          <Routes>
            {/* Default route redirects to the characters list */}
            <Route path="/" element={<Navigate to="/characters" />} />
            {/* Route for displaying all characters */}
            <Route
              path="/characters"
              element={
                <CharactersList user={user} refresh={refresh} type="all" />
              }
            />
            {/* Route for displaying favorite characters */}
            <Route
              path="/favorites"
              element={
                <CharactersList
                  user={user}
                  refresh={refresh}
                  type="favorites"
                />
              }
            />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
