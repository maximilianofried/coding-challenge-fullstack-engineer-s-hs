import React, { useState } from 'react';
import { useLazyQuery, useMutation, gql } from '@apollo/client';
import '../styles/Login.css'; // make sure this path is correct

const GET_USER = gql`
  query GetUser($username: String!) {
    getUser(username: $username) {
      username
      favoriteCharacters
    }
  }
`;

const LOGIN = gql`
  mutation Login($username: String!) {
    login(username: $username) {
      username
      favoriteCharacters
    }
  }
`;

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);

  const [getUser, { loading: getUserLoading }] = useLazyQuery(GET_USER, {
    onCompleted: data => {
      if (data && data.getUser) {
        onLogin(data.getUser);
      } else {
        handleLogin();
      }
    },
    onError: err => {
      if (err.message.includes('User not found')) {
        handleLogin();
      } else {
        setError(err.message);
      }
    },
  });

  const [login, { loading: loginLoading }] = useMutation(LOGIN, {
    onCompleted: data => {
      if (data && data.login) {
        onLogin(data.login);
      }
    },
    onError: err => {
      setError(err.message);
    },
  });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null); // Clear previous errors
    getUser({ variables: { username } });
  };

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
