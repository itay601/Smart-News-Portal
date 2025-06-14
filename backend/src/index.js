require('dotenv').config(); 
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const NodeCache = require('node-cache');
const typeDefs = require('./graphqlRequests/TypeDefs');
const resolvers = require('./graphqlRequests/resolvers')
const { getUserFromToken } = require('./auth/auth');


const app = express();
const cache = new NodeCache();


// Set up Apollo Server with context that includes the authenticated user and cache instance.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Expecting the HTTP header "Authorization: Bearer <token>"
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1];
    const user = getUserFromToken(token);
    
    return { user, cache };
  },
  // Optionally, use Apollo’s built-in cache control settings.
  cacheControl: {
    defaultMaxAge: 10,
  },
  // Enable introspection for development
  introspection: true,
  playground: true,
});


// Start the Apollo Server and apply it as middleware to the Express app.
async function startServer() {
  try {
    await server.start();
    server.applyMiddleware({ app, path: '/graphql' });
    
    const port = process.env.SERVER_PORT || 8000;
    app.listen({ port }, () => {
      console.log(`🚀 Server running at http://localhost:${port}${server.graphqlPath}`);
      console.log(`📊 GraphQL Playground available at http://localhost:${port}${server.graphqlPath}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

startServer();