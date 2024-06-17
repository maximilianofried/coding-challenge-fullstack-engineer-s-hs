import React from 'react';
import '../styles/Navbar.css';

const Navbar = ({
  displayFavorites,
  setDisplayFavorites,
  handleLogout,
  user,
}) => {
  return (
    <header className="navbar">
      <img src="/Rick_and_Morty.svg" alt="Rick and Morty logo" />
      <div>
        <button onClick={setDisplayFavorites}>
          {displayFavorites ? 'Display All' : 'Display Favorites'}
        </button>
        <button onClick={handleLogout}>Logout</button>
        {user && <button>{user.username}</button>}
      </div>
    </header>
  );
};

export default Navbar;
