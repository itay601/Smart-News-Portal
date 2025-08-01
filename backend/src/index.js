require('dotenv').config(); 
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const NodeCache = require('node-cache');
const typeDefs = require('./graphqlRequests/TypeDefs');
const resolvers = require('./graphqlRequests/resolvers')
const mysql = require('mysql2/promise'); // Pool for pg  or  require('mysql2') 
const buildContext = require('./graphqlRequests/context');
const helmet = require('helmet');
const cors = require('cors');
const {createDataAgentRouter,nvidiaAgentRouter,gemenaiAgentRouter, gemenaiCahtbotRouter} = require('./routes/dataForAgent');
const {authenticationRouter, RegisterRouter} = require('./auth/auth');


const pool = mysql.createPool({
  user: process.env.DB_USER,           
  host: process.env.DB_HOST,           
  database: process.env.DB_NAME,       
  password: String(process.env.DB_PASSWORD),
  port: process.env.DB_PORT,           
});
// Create pool instance (you might want to pass this from server.js instead)
//const pool = new Pool({
//  user: process.env.DB_USER,           
 // host: process.env.DB_HOST,           
  //database: process.env.DB_NAME,       
  //password: String(process.env.DB_PASSWORD),
  ///port: process.env.DB_PORT,           
//});


const app = express();
const cache = new NodeCache();

// Middleware & Rate Limiting
app.use(helmet());
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());


//routers!!!
const dataAgentRouter = createDataAgentRouter(pool);
const gemenaiagentRouter = gemenaiAgentRouter(pool);
const nvidiaagentRouter = nvidiaAgentRouter(pool);
const gemenaicahtbotRouter = gemenaiCahtbotRouter(pool);


const authRouter = authenticationRouter(pool);
const regRouter = RegisterRouter(pool);
app.use('/v1/api', dataAgentRouter);
app.use('/v1/api', gemenaiagentRouter);
app.use('/v1/api', nvidiaagentRouter);
app.use('/v1/api', gemenaicahtbotRouter);


app.use('/v1/auth', authRouter );
app.use('/v1/auth', regRouter);


app.get('/health', (req, res) => {
  res.send('OK');
});

// Set up Apollo Server with context that includes the authenticated user and cache instance.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: (req) => buildContext(req, cache, pool),
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