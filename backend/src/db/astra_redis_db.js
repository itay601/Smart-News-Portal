require('dotenv').config();
const { createClient } = require('redis');
const { DataAPIClient } = require('@datastax/astra-db-ts');

const ASTRA_TOKEN = process.env.ASTRA_TOKEN;
const ASTRA_ENDPOINT = process.env.ASTRA_ENDPOINT;

const client = new DataAPIClient(ASTRA_TOKEN);
const db = client.db(ASTRA_ENDPOINT);
const TRADING_COLLECTION = 'trading_bot';

function getTradingCollection() {
  return db.collection(TRADING_COLLECTION);
}

const redisClient = createClient({
  url: `redis://${process.env.REDIS_USERNAME ? process.env.REDIS_USERNAME + ':' : ''}${process.env.REDIS_PASSWORD ? process.env.REDIS_PASSWORD + '@' : ''}${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`
});
redisClient.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
})();

async function getState(userEmail) {
  const key = `user:${userEmail}`;
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
}

async function setState(userEmail, state) {
  const key = `user:${userEmail}`;
  const value = JSON.stringify(state);
  await redisClient.set(key, value);
  const data = await redisClient.get(key);
  return JSON.parse(data);
}
module.exports = { getTradingCollection,
                    redisClient,
                    setState,
                    getState };