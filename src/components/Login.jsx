import React, { useState } from 'react';
import { useLazyQuery, useMutation, gql } from '@apollo/client';

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

  if (getUserLoading || loginLoading) return <p>Loading...</p>;
  if (getUserError || loginError)
    return <p>Error :( {getUserError?.message || loginError?.message}</p>;

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
