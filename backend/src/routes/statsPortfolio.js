
const { getTradingCollection } = require('../db/astra_redis_db');
const { getState, setState } = require('../db/astra_redis_db');
const express = require('express');
const yahooFinance = require('yahoo-finance2').default;


function GetRedisDataStateAndAstraTradingPortfolio2() {
  const router = express.Router();

  // Helper function to get current stock prices
  async function getCurrentPrices(symbols) {
    try {
      const prices = {};
      for (const symbol of symbols) {
        try {
          const quote = await yahooFinance.quote(symbol);
          prices[symbol] = {
            price: quote.regularMarketPrice || quote.price,
            change: quote.regularMarketChange || 0,
            changePercent: quote.regularMarketChangePercent || 0,
            lastUpdated: new Date().toISOString()
          };
        } catch (err) {
          console.warn(`Failed to get price for ${symbol}:`, err.message);
          prices[symbol] = { price: null, error: 'Price unavailable' };
        }
      }
      return prices;
    } catch (error) {
      console.error('Error fetching prices:', error);
      return {};
    }
  }

  // Helper function to calculate portfolio statistics
  function calculatePortfolioStats(doc, currentPrices) {
    const allocations = doc.invest_analysis?.summary?.portfolio_analysis || [];
    let totalCurrentValue = 0;
    let totalInvested = 0;
    let totalPnL = 0;

    const updatedAllocations = allocations.map(allocation => {
      const currentPrice = currentPrices[allocation.ticker]?.price;
      const invested = allocation.invested || 0;
      const shares = allocation.shares || 0;
      
      totalInvested += invested;

      if (currentPrice && shares > 0) {
        const currentValue = shares * currentPrice;
        const pnl = currentValue - invested;
        const pnlPct = invested > 0 ? (pnl / invested) * 100 : 0;
        
        totalCurrentValue += currentValue;
        totalPnL += pnl;

        return {
          ...allocation,
          price_now: currentPrice,
          current_value: currentValue,
          pnl: pnl,
          pnl_pct: pnlPct,
          status: '✅ Updated',
          last_updated: new Date().toISOString()
        };
      } else {
        return {
          ...allocation,
          status: currentPrice ? '⚠️ No shares' : '❌ Price unavailable',
          last_updated: new Date().toISOString()
        };
      }
    });

    const totalPnLPct = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;
    const budget = doc.user_preferences?.budget || 0;
    const remainingBudget = budget - totalInvested;

    return {
      portfolio_analysis: updatedAllocations,
      summary: {
        total_invested: totalInvested,
        total_current_value: totalCurrentValue,
        total_pnl: totalPnL,
        total_pnl_pct: totalPnLPct,
        budget: budget,
        budget_remaining: remainingBudget,
        budget_deployed_pct: budget > 0 ? (totalInvested / budget) * 100 : 0,
        last_updated: new Date().toISOString()
      }
    };
  }

  // Helper function to generate simple statistics
  function generateSimpleStats(docs) {
    if (!docs || docs.length === 0) return null;

    const stats = docs.map(doc => {
      const summary = doc.invest_analysis?.summary;
      const preferences = doc.user_preferences || {};
      
      return {
        user_email: doc.user_email,
        strategy: preferences.strategy || 'unknown',
        risk_level: preferences.risk || 'medium',
        budget: preferences.budget || 0,
        invested: summary?.total_invested || 0,
        current_value: summary?.total_current_value || 0,
        pnl_pct: summary?.total_pnl_pct || 0,
        deployment_pct: summary?.budget_deployed_pct || 0,
        active_positions: summary?.portfolio_analysis?.filter(p => p.shares > 0).length || 0,
        total_positions: summary?.portfolio_analysis?.length || 0
      };
    });

    // Aggregate statistics
    const totalUsers = stats.length;
    const avgDeployment = stats.reduce((sum, s) => sum + s.deployment_pct, 0) / totalUsers;
    const avgReturn = stats.reduce((sum, s) => sum + s.pnl_pct, 0) / totalUsers;
    const totalInvested = stats.reduce((sum, s) => sum + s.invested, 0);

    return {
      individual_portfolios: stats,
      aggregate: {
        total_users: totalUsers,
        total_invested: totalInvested,
        avg_deployment_pct: avgDeployment,
        avg_return_pct: avgReturn,
        risk_distribution: {
          low: stats.filter(s => s.risk_level === 'low').length,
          medium: stats.filter(s => s.risk_level === 'medium').length,
          high: stats.filter(s => s.risk_level === 'high').length
        }
      }
    };
  }

  router.get('/InvestmentAnalysisPortfolio', async (req, res) => {
    try {
      const { user, cache, pool } = req.context;
      
      // Get Astra documents
      const collection = getTradingCollection();
      const docs = await collection.find({'user_email': user.user_email}).toArray();//"itaymerel1212@gmail.com"}).toArray();
      console.log('Astra docs found:', docs.length);

      if (docs.length === 0) {
        return res.json({ 
          message: 'No portfolios found',
          astraDocs: [],
          redisState: null,
          stats: null
        });
      }

      // Extract all unique stock symbols
      const allSymbols = new Set();
      docs.forEach(doc => {
        const allocations = doc.invest_analysis?.summary?.portfolio_analysis || [];
        allocations.forEach(allocation => {
          if (allocation.ticker) {
            allSymbols.add(allocation.ticker);
          }
        });
      });

      // Get current prices for all symbols
      console.log('Fetching prices for:', Array.from(allSymbols));
      const currentPrices = await getCurrentPrices(Array.from(allSymbols));

      // Update documents with current prices and calculations
      const updatedDocs = docs.map(doc => {
        const updatedAnalysis = calculatePortfolioStats(doc, currentPrices);
        return {
          ...doc,
          invest_analysis: {
            ...doc.invest_analysis,
            ...updatedAnalysis
          },
          price_data: currentPrices,
          last_updated: new Date().toISOString()
        };
      });

      // Generate simple statistics
      const stats = generateSimpleStats(updatedDocs);

      // Get Redis state
      const redisState = await getState(user.user_email);//"itaymerel1212@gmail.com");

      // Optional: Update documents in database with new price data
      // Uncomment if you want to persist the updated data
      /*
      for (const doc of updatedDocs) {
        await collection.updateOne(
          { _id: doc._id },
          { 
            $set: { 
              invest_analysis: doc.invest_analysis,
              last_updated: doc.last_updated 
            } 
          }
        );
      }
      */

      res.json({ 
        astraDocs: updatedDocs, 
        //redisState: redisState,
        stats: stats,
        market_data: {
          symbols_tracked: Array.from(allSymbols),
          price_success_rate: Object.values(currentPrices).filter(p => p.price !== null).length / allSymbols.size * 100,
          last_updated: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Error in InvestmentAnalysisPortfolio:', error);
      res.status(500).json({ 
        error: 'Failed to fetch portfolio analysis',
        message: error.message 
      });
    }
  });

  // Additional endpoint for real-time price updates only
  router.get('/prices/:symbols', async (req, res) => {
    try {
      const symbols = req.params.symbols.split(',');
      const prices = await getCurrentPrices(symbols);
      res.json({ prices, timestamp: new Date().toISOString() });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch prices' });
    }
  });

  return router;
}

module.exports = { GetRedisDataStateAndAstraTradingPortfolio2 };