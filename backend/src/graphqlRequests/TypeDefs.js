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
    source_name: String
    author: String
    title: String!
    description: String
    url: String
    urlToImage: String
    content: String!
    economic_terms: String
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
  
  type Tweet {
    tweet_id: ID!
    author_id: String!
    created_at: String!
    text: String!
    retweet_count: Int!
    reply_count: Int!
    like_count: Int!
    quote_count: Int!
    lang: String!
  }

  type Events {
    date: String!
    title: String!
    url: String!
  }  

  type Query {
    articles: [Article]
    getAllUsers: [User!]!
    getUserByUsername(username: String!): User
    getUserWithPasswords(username: String!): UserWithPasswords
    me: User
    stockPrices: [StockPrice]
    specificStockPrices(symbol: String!) : [StockPrice]
    tweets: [Tweet!]!
    calenderEvents: [Events]
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
