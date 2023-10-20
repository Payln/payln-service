import IORedis from "ioredis";
import { configs } from "../utils/config";
import logger from "../logger/logger";
import { DefaultJobOptions, KeepJobs } from "bullmq";

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

export const defaultJobOptions: DefaultJobOptions = {
  attempts: 10,
  backoff: {
    type: "exponential",
    delay: 3000,
  }
};

export const removeOnFail: KeepJobs = {
  age: 240,
};

export const redisConn = newRedisConn();