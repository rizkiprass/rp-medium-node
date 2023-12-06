const redis = require('redis');
const { REDIS_HOST, REDIS_PORT } = process.env;
const redisClient = redis.createClient({
  host: REDIS_HOST || 'localhost',
  port: REDIS_PORT || 6379,
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

function setWithExpiration(key, value, expirationInSeconds) {
  redisClient.setex(key, expirationInSeconds, value);
}

function get(key, callback) {
  redisClient.get(key, (err, data) => {
    if (err) {
      console.error('Error fetching from Redis cache:', err);
    }
    callback(data ? JSON.parse(data) : null);
  });
}

module.exports = {
  redisClient,
  setWithExpiration,
  get,
};
