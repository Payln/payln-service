import { redisConn } from "../bg_workers/worker";
import logger from "../logger/logger";

// Function to add a key to Redis
async function addToRedis(key: string, value: string, ttlInSeconds: number) {
  try {
    await redisConn.set(key, value, "EX", ttlInSeconds);
    return true;
  } catch (error) {
    logger.error("Error adding to Redis:", error);
    throw new Error("Failed to add to Redis");
  }
}

// Function to check if a key exists in Redis
async function checkInRedis(key: string) {
  try {
    const exists = await redisConn.exists(key);
    return exists === 1;
  } catch (error) {
    logger.error("Error checking key in Redis:", error);
    throw new Error("Failed to check for key in Redis");
  }
}

// Function to delete a key from Redis
async function deleteFromRedis(key: string) {
  try {
    await redisConn.del(key);
    return true;
  } catch (error) {
    logger.error("Error deleting from Redis:", error);
    throw new Error("Failed to delete key from Redis");
  }
}

export {
  addToRedis,
  checkInRedis,
  deleteFromRedis
};