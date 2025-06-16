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
    getAllUsers: async (_, __, { pool, context }) => {
      // const currentUser = await getUserFromToken(context.token);
      // requireAdmin(currentUser);
      
      const result = await pool.query(
        'SELECT username, email, role FROM users ORDER BY username'
      );
      
      return result.rows;
    },
    // Admin-only: Get specific user by username
    getUserByUsername: async (_, { username }, { pool, context }) => {
      // const currentUser = await getUserFromToken(context.token);
      // requireAdmin(currentUser);
      
      const result = await pool.query(
        'SELECT username, email, role FROM users WHERE username = $1',
        [username]
      );
      
      if (result.rows.length === 0) {
        throw new Error('User not found');
      }
      
      return result.rows[0];
    },
    // Admin-only: Get user with password history
    getUserWithPasswords: async (_, { username }, { pool, context }) => {
      // const currentUser = await getUserFromToken(context.token);
      // requireAdmin(currentUser);
      
      const userResult = await pool.query(
        'SELECT username, email, role FROM users WHERE username = $1',
        [username]
      );
      
      if (userResult.rows.length === 0) {
        throw new Error('User not found');
      }
      
      const passwordResult = await pool.query(
        'SELECT passwordtemp, passwordsecond, passwordthird FROM userpass WHERE uname = $1',
        [username]
      );
      
      const user = userResult.rows[0];
      const passwords = passwordResult.rows[0] || {};
      
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
    }
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