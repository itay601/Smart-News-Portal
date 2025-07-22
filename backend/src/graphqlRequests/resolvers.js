const { getUserFromToken } = require('../auth/auth');

const resolvers = {
  Query: {
    articles: async (_, __, { cache, pool }) => {
      try {
        const cachedArticles = cache.get('articles');
        if (cachedArticles) {
          console.log('Returning articles from cache');
          return cachedArticles;
        }
        
        const [rows] = await pool.query('SELECT * FROM articles_table ORDER BY id');
        cache.set('articles', rows, 10);
        console.log('Returning articles from database');
        return rows;
      } catch (error) {
        console.error('Error fetching articles:', error);
        throw new Error('Failed to fetch articles');
      }
    },
    getAllUsers: async (_, __, {cache ,pool, context }) => {
      // const currentUser = await getUserFromToken(context.token);
      // requireAdmin(currentUser);
      const cachedUsers = cache.get('users');
        if (cachedUsers) {
          console.log('Returning articles from cache');
          return cachedUsers;
        }
      const [rows] = await pool.query(
        'SELECT username, email, role FROM user ORDER BY username'
      );
      cache.set('users', rows, 10);
      console.log('Returning users from database');
      return rows;
    },
    // Admin-only: Get specific user by username
    getUserByUsername: async (_, { username }, { pool, context }) => {
      // const currentUser = await getUserFromToken(context.token);
      // requireAdmin(currentUser);
      
      const [rows] = await pool.query(
        'SELECT username, email, role FROM user WHERE username = ?',
        [username]
      );
      
      if (rows.length === 0) {
        throw new Error('User not found');
      }
      
      return rows[0];
    },
    // Admin-only: Get user with password history
    getUserWithPasswords: async (_, { username }, { pool, context }) => {
      // const currentUser = await getUserFromToken(context.token);
      // requireAdmin(currentUser);
      
      const [userResult] = await pool.query(
        'SELECT username, email, role FROM user WHERE username = ?',
        [username]
      );
      
      if (userResult.length === 0) {
        throw new Error('User not found');
      }
      
      const [passwordResult] = await pool.query(
        'SELECT passwordtemp, passwordsecond, passwordthird FROM userpass WHERE uname = ?',
        [username]
      );
      
      const user = userResult[0];
      const passwords = passwordResult[0] || {};
      
      return {
        username: user.username,
        email: user.email,
        role: user.role,
        passwordTemp: passwords.passwordtemp,
        passwordSecond: passwords.passwordsecond,
        passwordThird: passwords.passwordthird,
      };
    },
    // Regular user: Get own profile
    me: async (_, __, { context }) => {
      // Ensure that getUserFromToken is defined and imported correctly
      const currentUser = await getUserFromToken(context.token);
      if (!currentUser) {
        throw new Error('Authentication required');
      }
      return currentUser;
    },

    // Get all stock prices
    stockPrices: async (_, __, { cache, pool }) => {
      try {
        const cachedStockPrices = cache.get('stockPrices');
        if (cachedStockPrices) {
          console.log('Returning stock prices from cache');
          return cachedStockPrices;
        }
        
        // Assuming that the table "stock_prices" exists in your database
        const [rows] = await pool.query('SELECT * FROM stock_prices ORDER BY symbol, date');
        cache.set('stockPrices', rows, 10);
        console.log('Returning stock prices from database');
        return rows;
      } catch (error) {
        console.error('Error fetching stock prices:', error);
        throw new Error('Failed to fetch stock prices');
      }
    }
  },

  Mutation: {
    deleteArticle: async (_, { id }, { user, cache, pool }) => {
      if (!user) {
        throw new Error("You must be signed in to delete an article.");
      }
      
      try {
        const [result] = await pool.query('DELETE FROM articles_table WHERE id = ?', [id]);
        cache.del('articles');
        return result.affectedRows  > 0;
      } catch (error) {
        console.error('Error deleting article:', error);
        throw new Error('Failed to delete article');
      }
    },
  },
};

module.exports = resolvers;