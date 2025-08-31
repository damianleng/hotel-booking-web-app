const Redis = require("ioredis");

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT || 6379),
  password: process.env.REDIS_PASSWORD,
});



redis.on("connect", () => console.log("Connected to Redis"));
redis.on("error", () => console.error("Redis Error"));

module.exports = redis;
