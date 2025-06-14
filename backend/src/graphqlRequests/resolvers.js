const { Pool } = require('pg'); // or  require('mysql2') -- MySQL

// Create pool instance (you might want to pass this from server.js instead)
const pool = new Pool({
  user: process.env.DB_USER,           
  host: process.env.DB_HOST,           
  database: process.env.DB_NAME,       
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,           
});

const resolvers = {
  Query: {
    articles: async (_, __, { cache, pool }) => {
      try {
        const cachedArticles = cache.get('articles');
        if (cachedArticles) {
          console.log('Returning articles from cache');
          return cachedArticles;
        }
        
        const { rows } = await pool.query('SELECT * FROM articles ORDER BY id');
        cache.set('articles', rows, 10);
        console.log('Returning articles from database');
        return rows;
      } catch (error) {
        console.error('Error fetching articles:', error);
        throw new Error('Failed to fetch articles');
      }
    },
  },
  Mutation: {
    deleteArticle: async (_, { id }, { user, cache, pool }) => {
      if (!user) {
        throw new Error("You must be signed in to delete an article.");
      }
      
      try {
        const result = await pool.query('DELETE FROM articles WHERE id = $1', [id]);
        cache.del('articles');
        return result.rowCount > 0;
      } catch (error) {
        console.error('Error deleting article:', error);
        throw new Error('Failed to delete article');
      }
    },
  },
};

module.exports = resolvers;