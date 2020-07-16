import dotenv from 'dotenv';
import Redis from 'ioredis';
import JSONCache from 'redis-json';
// Dotenv config
dotenv.config();

const {
  REDIS_HOST,
  REDIS_PORT,
} = process.env;

// Redis
const redisCache = new Redis({ host: REDIS_HOST, port: REDIS_PORT });
const redis = new JSONCache(redisCache);
// IPFS
export { redis };
