// graphql/queries.js
import { gql } from '@apollo/client';

export const GET_CHARACTERS = gql`
  query GetCharacters($page: Int!) {
    getCharacters(page: $page) {
      info {
        count
        pages
        next
        prev
      }
      results {
        id
        name
        image
        species
        gender
        origin {
          name
          dimension
        }
        status
        episode {
          id
        }
      }
    }
  }
`;

export const GET_FAVORITE_CHARACTERS = gql`
  query GetFavoriteCharacters($username: String!, $page: Int!) {
    getFavoriteCharacters(username: $username, page: $page) {
      info {
        count
        pages
        next
        prev
      }
      results {
        id
        name
        image
        species
        gender
        origin {
          name
          dimension
        }
        status
        episode {
          id
        }
      }
    }
  }
`;

export const GET_USER_FAVORITES = gql`
  query GetUserFavorites($username: String!) {
    getUser(username: $username) {
      favoriteCharacters
    }
  }
`;

export const TOGGLE_FAVORITE_CHARACTER = gql`
  mutation ToggleFavoriteCharacter($username: String!, $characterId: String!) {
    toggleFavoriteCharacter(username: $username, characterId: $characterId)
  }
`;

export const GET_EPISODES_BY_IDS = gql`
  query GetEpisodesByIds($ids: [ID!]!) {
    getEpisodesByIds(ids: $ids) {
      id
      name
      air_date
    }
  }
`;

export const GET_USER = gql`
  query GetUser($username: String!) {
    getUser(username: $username) {
      username
      favoriteCharacters
    }
  }
`;

export const LOGIN = gql`
  mutation Login($username: String!) {
    login(username: $username) {
      username
      favoriteCharacters
    }
  }
`;
