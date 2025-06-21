const { gql } = require('apollo-server-express');

// GraphQL Type Definitions
const typeDefs = gql`
  type User {
    username: String!
    email: String!
    role: String
    password: String!
  }
  
  type UserWithPasswords {
    username: String!
    email: String!
    role: String
    passwordTemp: String
    passwordSecond: String
    passwordThird: String
  }

  type Article {
    id: ID!
    title: String!
    content: String
    createdAt: String
  }

  type StockPrice {
    symbol: String!
    date: String! 
    open: Float
    high: Float
    low: Float
    close: Float
    volume: Float 
  }
  
  type Query {
    articles: [Article]
    getAllUsers: [User!]!
    getUserByUsername(username: String!): User
    getUserWithPasswords(username: String!): UserWithPasswords
    me: User
    stockPrices: [StockPrice]
  }
   type AuthPayload {
    token: String!
    user: User!
  }

  type Mutation {
    deleteArticle(id: ID!): Boolean
  }
`;

module.exports = typeDefs;
