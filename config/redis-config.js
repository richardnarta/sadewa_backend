require('dotenv').config();

const { createClient } = require('redis');

let redisClient;
const redisHost = process.env.REDIS_HOST
const redisPort = process.env.REDIS_PORT

const connectRedis = async () => {
  redisClient = createClient(
    {
      url: `redis://${redisHost}:${redisPort}`
    }
  );

  redisClient.on('error', (err) => {
    console.error('Redis client error:', err);
  });

  await redisClient.connect();
};

connectRedis();

const getClient = async () => {
  if (!redisClient || !redisClient.isOpen) {
    await connectRedis();
  }
  return redisClient;
};

const closeRedis = async () => {
  if (redisClient && redisClient.isOpen) {
    await redisClient.quit();
  }
};

module.exports = {
  getClient,
  closeRedis
};