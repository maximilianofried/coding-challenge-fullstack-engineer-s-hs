import React, { useEffect, useState } from 'react';
import Login from '../components/Login';
import Provider from '../api/Provider';
import PickleRick from '../components/PickleRick';

import './App.css';

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogin = userData => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Provider>
      <div className="App">
        {user ? (
          <>
            <button onClick={handleLogout}>Logout</button>
            <PickleRick />
          </>
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </div>
    </Provider>
  );
};

export default App;
