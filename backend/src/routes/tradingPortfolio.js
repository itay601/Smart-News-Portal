const { getTradingCollection } = require('../db/astra_redis_db');
const { getState, setState } = require('../db/astra_redis_db');
const express = require('express');

function GetRedisDataStateAndAstraTradingPortfolio() {
  const router = express.Router();

  router.get('/InvestmentAnalysisPortfolio', async (req, res) => {
    const { user, cache , pool } = req.context;
    if(!user){
      throw new Error('need to auth before');
    }
    
     // Astra collection
    const collection = getTradingCollection();
    const docs = await collection.find({'user_email':user.user_email}).toArray();
    console.log('Astra docs:', docs);

    // Redis state
    //await setState('test@example.com', { balance: 500, positions: ['AAPL', 'TSLA'] });
    const state = await getState(user.user_email);
    console.log('Redis state:', state);



    res.json({ astraDocs: docs, redisState: state });
  });
  return router;
}

module.exports = {GetRedisDataStateAndAstraTradingPortfolio};

