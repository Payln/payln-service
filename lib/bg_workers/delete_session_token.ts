import { Queue, Worker, Job } from "bullmq";
import logger from "../logger/logger";
import sessionTokenClass from "../payln/session_tokens/session_tokens";
import { defaultJobOptions, redisConn, removeOnFail } from "./worker";

const deleteSessionTokenQueue = new Queue("sessionTokenQueue", {
  connection: redisConn, defaultJobOptions
});

const sessionTokenWorker = new Worker<DeleteSessionTokenParams>("sessionTokenQueue", async (job: Job) => {
  await sessionTokenClass.deleteSessionToken(job.data.sessionTokenId);
}, {
  connection: redisConn, removeOnFail
});

sessionTokenWorker.on("completed", (job: Job) => {
  logger.info(`Delete session token job ${job.id} completed`);
});

sessionTokenWorker.on("failed", (job, error) => {
  logger.error(`Delete session token job ${job?.id} failed with error ${error.message}`);
});

sessionTokenWorker.on("error", err => {
  logger.error(err.stack);
});

export { deleteSessionTokenQueue, sessionTokenWorker };