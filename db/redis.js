const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient();

client.on('error', (err) => {
  console.error('Redis error: ', err);
});

const setAsync = promisify(client.set).bind(client);
const expireAsync = promisify(client.expire).bind(client);

module.exports = {
  setAsync,
  expireAsync,
};
