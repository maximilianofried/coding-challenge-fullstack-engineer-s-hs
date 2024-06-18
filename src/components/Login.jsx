import React, { useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_USER, LOGIN } from '../api/queries';
import '../styles/Login.css';

/**
 * Login component for user authentication.
 * @param {function} onLogin - Function to call when a user successfully logs in.
 */
const Login = ({ onLogin }) => {
  // State to manage the input username
  const [username, setUsername] = useState('');

  // State to manage error messages
  const [error, setError] = useState(null);

  // Lazy query to get the user details
  const [getUser, { loading: getUserLoading }] = useLazyQuery(GET_USER, {
    onCompleted: data => {
      if (data && data.getUser) {
        // If user exists, call onLogin with user data
        onLogin(data.getUser);
      } else {
        // If user does not exist, proceed to create a new user
        handleLogin();
      }
    },
    onError: err => {
      if (err.message.includes('User not found')) {
        // If the error indicates user not found, create a new user
        handleLogin();
      } else {
        // Set other errors to state
        setError(err.message);
      }
    },
  });

  // Mutation to log in the user
  const [login, { loading: loginLoading }] = useMutation(LOGIN, {
    onCompleted: data => {
      if (data && data.login) {
        // If login is successful, call onLogin with user data
        onLogin(data.login);
      }
    },
    onError: err => {
      // Set login errors to state
      setError(err.message);
    },
  });

  /**
   * Handle form submission for login.
   * @param {Object} e - Event object.
   */
  const handleSubmit = async e => {
    e.preventDefault();
    setError(null); // Clear previous errors
    getUser({ variables: { username } });
  };

  /**
   * Handle login or user creation.
   */
  const handleLogin = () => {
    login({ variables: { username } });
  };

  return (
    <div className="login-card">
      <img src="/rick_and_morty.svg" alt="rick and morty logo" />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        {getUserLoading || loginLoading ? (
          <p>Loading...</p>
        ) : (
          <button type="submit">Login</button>
        )}

        {error && (
          <p className="error">
            Error: It's like Rick tried to portal you in, but you ended up in
            Cronenberg world instead. Try again!
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;
