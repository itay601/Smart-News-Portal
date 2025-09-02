const express = require('express');
const axios = require('axios');

//data for agent
function createDataAgentRouter(pool) {
  const router = express.Router();

  router.post('/dataagent', async (req, res) => {
    const economic_term = req.query.economic_term;
    const symbol = req.query.symbol;

    if (!economic_term) {
      return res.status(400).json({ error: 'economic_term query parameter is required.' });
    }
      //CHANGE IN PRODUCTION
    try {
      // Query for articles_table using economic_term
      const query1 =   'SELECT * FROM articles_table WHERE economic_terms = ?'; //'SELECT * FROM articles WHERE economic_term = $1';
      const [raw1] = await pool.query(query1, [economic_term]);

      // If symbol is provided, also fetch data for stock_prices
      if (symbol) {
        const query2 = 'SELECT * FROM stock_prices WHERE symbol = ?';
        const [raw2] = await pool.query(query2, [symbol]);
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


function nvidiaAgentRouter() {
  const router = express.Router();

  router.post('/nvidiaAgent', async (req, res) => {
    const user_message = req.body.message;
    if (!user_message) {
      return res.status(400).json({ error: 'user_message query parameter is required.' });
    }
    const chatbotURL = 'http://chatbot-service:9090/chatbot/chatbotNvidia';

    try {
      // Send request to chatbot service
      const response = await axios.post(chatbotURL, {
      message: user_message 
      });

      // Return chatbot's response
      res.json(response.data);
    } catch (error) {
      console.error('Error communicating with chatbot service:', error.message);
      res.status(500).json({ error: 'Failed to talk to chatbot service.' });
    }
  });

  return router;
}


function gemenaiAgentRouter() {
  const router = express.Router();

  router.post('/gemenaiAgentAnalysis', async (req, res) => {
    // Get data from request body instead of query parameters for POST
    const user_message = req.body.message;
    const economic_term = req.body.economic_term;
    const symbol = req.body.symbol;

    if (!user_message) {
      return res.status(400).json({ error: 'message field is required in request body.' });
    }
    if (!economic_term) {
      return res.status(400).json({ error: 'economic_term field is required in request body.' });
    }

    const chatbotURL = 'http://chatbot-service:9090/chatbot/anlasisysAgent';

    try {
      // Send POST request to chatbot service with data in body
      const response = await axios.post(chatbotURL, {
      query: user_message,
      economic_term,
      symbol
      });

      // Return chatbot's response
      res.json(response.data);
    } catch (error) {
      console.error('Error communicating with chatbot service:', error.message);
      res.status(500).json({ error: 'Failed to talk to chatbot service.' });
    }
  });

  return router;
}

function gemenaiCahtbotRouter() {
  const router = express.Router();

  router.post('/gemenaiChatbot', async (req, res) => {
    const user_message = req.body.message;
    const user_id = req.body.user_id;
    if (!user_message || !user_id) {
      return res.status(400).json({ error: 'user_message/user_id query parameter is required.' });
    }
    const chatbotURL = 'http://chatbot-service:9090/chatbot/chatbotGemenai';

    try {
      // Send request to chatbot service
        const response = await axios.post(chatbotURL, {
          user_id: user_id,
          message: user_message
        });
      // Return chatbot's response
        res.json(response.data);
    } catch (error) {
        console.error('Error communicating with chatbot service:', error.message);
        res.status(500).json({ error: 'Failed to talk to chatbot service.' });
    }
  });

  return router;
}

function userPrefTradingCahtbotRouter() {
  const router = express.Router();

  router.post("/userTradingAgents", async (req, res) => {
    const {
      user_email,
      query,
      budget,
      risk,
      mode,
      strategy,
      stop_loss,
      take_profit,
      max_drawdown,
      leverage,
      trade_frequency,
      preferred_markets,
    } = req.body;

    // Validate required fields
    if (!user_email || !query || !budget || !mode) {
      return res.status(400).json({
        error: "user_email and query are required fields.",
      });
    }

    const chatbotURL = "http://chatbot-service:9090/chatbot/userTradingAgents";

    try {
      // Forward request to chatbot service
      const response = await axios.post(chatbotURL, {
        user_email,
        query,
        budget,
        risk,
        mode,
        strategy,
        stop_loss,
        take_profit,
        max_drawdown,
        leverage,
        trade_frequency,
        preferred_markets,
      });

      // Return chatbot's response
      res.json(response.data);
    } catch (error) {
      console.error("Error communicating with chatbot service:", error.message);
      res.status(500).json({ error: "Failed to talk to chatbot service." });
    }
  });

  return router;
}

function userPrefTradingCahtbotCronjobAPIRouter() {
    const router = express.Router();
    router.get("/cronTradingAgents", async (req, res) => {
    const chatbotURL = "http://chatbot-service:9090/chatbot/cronTradingAgents";

    try {
      const response = await axios.get(chatbotURL);
      res.json(response.data);
    } catch (error) {
      console.error("Error communicating with chatbot service:", error.message);
      res.status(500).json({ error: "Failed to talk to chatbot service." });
    }
  });

  return router;
}

module.exports ={
  userPrefTradingCahtbotCronjobAPIRouter,
  userPrefTradingCahtbotRouter,
  createDataAgentRouter,
  nvidiaAgentRouter,
  gemenaiAgentRouter,
  gemenaiCahtbotRouter
  };