const { gql } = require('apollo-server-express');

// GraphQL Type Definitions
const typeDefs = gql`
  type Article {
    id: ID!
    title: String!
    content: String
    createdAt: String
  }
  
  type Query {
    articles: [Article]
  }
  
  type Mutation {
    deleteArticle(id: ID!): Boolean
  }
`;

module.exports = typeDefs;
//export default typeDefs;