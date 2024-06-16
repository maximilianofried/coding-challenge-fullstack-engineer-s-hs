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
  const [getUser, { loading: getUserLoading, error: getUserError }] =
    useLazyQuery(GET_USER);
  const [login, { loading: loginLoading, error: loginError }] =
    useMutation(LOGIN);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { data: userData } = await getUser({ variables: { username } });
      if (userData && userData.getUser) {
        onLogin(userData.getUser);
      } else {
        const { data: newUser } = await login({ variables: { username } });
        if (newUser && newUser.login) {
          onLogin(newUser.login);
        }
      }
    } catch (err) {
      console.error(err);
    }
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

        {(getUserError?.message || loginError?.message) && (
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
