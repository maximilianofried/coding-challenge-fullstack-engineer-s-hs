import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = ({ setDisplayFavorites, handleLogout, user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const displayFavorites = location.pathname === '/favorites';

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
      <img src="/Rick_and_Morty.svg" alt="Rick and Morty logo" />
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
