require('dotenv').config(); 
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const NodeCache = require('node-cache');
const typeDefs = require('./graphqlRequests/TypeDefs');
const resolvers = require('./graphqlRequests/resolvers')
const { getUserFromToken } = require('./auth/auth');
const { Pool } = require('pg'); // or  require('mysql2') -- MySQL



// Create pool instance (you might want to pass this from server.js instead)
const pool = new Pool({
  user: process.env.DB_USER,           
  host: process.env.DB_HOST,           
  database: process.env.DB_NAME,       
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,           
});

const app = express();
const cache = new NodeCache();


// Set up Apollo Server with context that includes the authenticated user and cache instance.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Expecting "Authorization: Bearer <token>"
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1];
    const user = getUserFromToken(token);
    console.log("user:", user)
    return { user, cache, pool};
  },
  //Apollo’s built-in cache control settings.
  cacheControl: {
    defaultMaxAge: 30,
  },
  // Enable for development
  introspection: true,
  playground: true,
});


// Apollo Server , apply it as middleware to the Express app.
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