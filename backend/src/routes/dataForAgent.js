const express = require('express');
const router = express.Router();


function createDataAgentRouter(pool) {
  const router = express.Router();

  router.get('/dataagent', async (req, res) => {
    const economic_term = req.query.economic_term;
    const symbol = req.query.symbol;

    if (!economic_term) {
      return res.status(400).json({ error: 'economic_term query parameter is required.' });
    }
      //CHANGE IN PRODUCTION
    try {
      // Query for articles_table using economic_term
      const query1 =   'SELECT * FROM articles WHERE title = $1'; //'SELECT * FROM articles WHERE economic_term = $1';
      const { rows: raw1 } = await pool.query(query1, [economic_term]);

      // If symbol is provided, also fetch data for stock_prices
      if (symbol) {
        const query2 = 'SELECT * FROM stock_prices WHERE symbol = $1';
        const { rows: raw2 } = await pool.query(query2, [symbol]);
        return res.json({ raw1, raw2 });
      }
      res.json(raw1);
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
  });

  return router;
}

module.exports = createDataAgentRouter;