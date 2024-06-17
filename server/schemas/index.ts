import { gql } from 'graphql-tag';

const typeDefs = gql`
  type User {
    username: String
    favoriteCharacters: [String]
  }

  type Character {
    id: ID
    name: String
    image: String
    species: String
    gender: String
    origin: Origin
    status: String
    episode: [Episode]
    lastUpdated: String
    page: Int
  }

  type Origin {
    name: String
    dimension: String
  }

  type Episode {
    id: ID
    name: String
    air_date: String
  }

  type Query {
    getUser(username: String!): User
    getCharacters(page: Int): [Character]
    getEpisodesByIds(ids: [ID!]!): [Episode!]!
    getFavoriteCharacters(username: String!, page: Int): [Character]
  }

  type Mutation {
    login(username: String!): User
    toggleFavoriteCharacter(username: String!, characterId: String!): [String]
  }
`;

export default typeDefs;
