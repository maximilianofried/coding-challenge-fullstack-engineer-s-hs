import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

/**
 * Navbar component for navigation and user actions.
 * @param {function} setDisplayFavorites - Function to toggle the display of favorite characters.
 * @param {function} handleLogout - Function to handle user logout.
 * @param {Object} user - The current logged-in user object.
 */
const Navbar = ({ setDisplayFavorites, handleLogout, user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if the current path is for displaying favorites
  const displayFavorites = location.pathname === '/favorites';

  /**
   * Handles toggling between displaying all characters and favorites.
   */
  const handleDisplayFavoritesToggle = () => {
    if (displayFavorites) {
      navigate('/characters');
    } else {
      navigate('/favorites');
    }
    setDisplayFavorites(!displayFavorites);
  };

  return (
    <header className="navbar">
      {/* Logo linking to the home page */}
      <a href="/" className="logo">
        <img src="/rick_and_morty.svg" alt="Rick and Morty logo" />
      </a>

      {/* Navigation buttons and user info */}
      <div>
        <button onClick={handleDisplayFavoritesToggle}>
          {displayFavorites ? 'Display All' : 'Display Favorites'}
        </button>
        <button onClick={handleLogout}>Logout</button>
        {user && <button>{user.username}</button>}
      </div>
    </header>
  );
};

export default Navbar;
