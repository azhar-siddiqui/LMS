import Redis from "ioredis";
require("dotenv").config();

const redisClient = () => {
  if (process.env.RADIUS_URL) {
    console.log(`Radis Connected`);
    return process.env.RADIUS_URL;
  }
  throw new Error(`Radis Connection failed`);
};

export const redis = new Redis(redisClient());
