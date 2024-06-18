import { gql } from '@apollo/client';

/**
 * GraphQL query to fetch a paginated list of characters.
 * @param {Int} page - The page number to fetch.
 */
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

/**
 * GraphQL query to fetch a paginated list of favorite characters for a user.
 * @param {String} username - The username of the user.
 * @param {Int} page - The page number to fetch.
 */
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

/**
 * GraphQL query to fetch a user's favorite character IDs.
 * @param {String} username - The username of the user.
 */
export const GET_USER_FAVORITES = gql`
  query GetUserFavorites($username: String!) {
    getUser(username: $username) {
      favoriteCharacters
    }
  }
`;

/**
 * GraphQL mutation to toggle the favorite status of a character for a user.
 * @param {String} username - The username of the user.
 * @param {String} characterId - The ID of the character to toggle.
 */
export const TOGGLE_FAVORITE_CHARACTER = gql`
  mutation ToggleFavoriteCharacter($username: String!, $characterId: String!) {
    toggleFavoriteCharacter(username: $username, characterId: $characterId)
  }
`;

/**
 * GraphQL query to fetch episodes by their IDs.
 * @param {Array<ID!>} ids - An array of episode IDs to fetch.
 */
export const GET_EPISODES_BY_IDS = gql`
  query GetEpisodesByIds($ids: [ID!]!) {
    getEpisodesByIds(ids: $ids) {
      id
      name
      air_date
    }
  }
`;

/**
 * GraphQL query to fetch user details.
 * @param {String} username - The username of the user.
 */
export const GET_USER = gql`
  query GetUser($username: String!) {
    getUser(username: $username) {
      username
      favoriteCharacters
    }
  }
`;

/**
 * GraphQL mutation to log in a user.
 * @param {String} username - The username of the user.
 */
export const LOGIN = gql`
  mutation Login($username: String!) {
    login(username: $username) {
      username
      favoriteCharacters
    }
  }
`;
