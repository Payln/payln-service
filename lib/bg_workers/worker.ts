import IORedis from "ioredis";
import { configs } from "../utils/config";
import logger from "../logger/logger";

export function newRedisConn() {
  const redis = new IORedis(configs.RedisAddress, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false
   });

  redis.on("error", (error) => {
    logger.error(`Redis connection error: ${error.message}`);
    process.exit(1);
  });

  return redis;
}

export const redisConn = newRedisConn();