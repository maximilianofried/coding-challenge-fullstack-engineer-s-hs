import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

/**
 * Apollo Client configuration for connecting to the GraphQL server.
 * The URI is fetched from environment variables.
 */
const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URI,
  cache: new InMemoryCache(),
});

/**
 * Provider component to wrap the application with ApolloProvider.
 * This component sets up the Apollo Client for the entire React application.
 * @param {Object} children - The child components to be wrapped by ApolloProvider.
 */
const Provider = ({ children }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

export default Provider;
