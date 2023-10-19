import { Queue, Worker, Job } from "bullmq";
import sender from "../mailer/sender";
import otpGenerator from "../otp/otp";
import logger from "../logger/logger";
import sessionTokenClass from "../payln/session_tokens/session_tokens";
import { redisConn } from "./worker";


function emailVerificationTemplate(otp: string, userFirstName: string) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f5f5f5;
              margin: 0;
              padding: 0;
          }
          .container {
              max-width: 500px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 5px;
              box-shadow: 0px 3px 10px rgba(0,0,0,0.1);
          }
          h1 {
              color: #333;
              text-align: center;
          }
          p {
              color: #777;
              font-size: 16px;
              text-align: center;
          }
          .otp-code {
              text-align: center;
              font-size: 36px;
              font-weight: bold;
              color: #007bff;
              margin-top: 20px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <span>Hi ${userFirstName},</span>
          <p>Thank you for signing up with PayLN. To complete your registration, please enter the OTP code below:</p>
          <div class="otp-code">${otp}</div>
          <p>This OTP is valid for 10 minutes.</p>
          <p>If you didn't request this OTP, please ignore this message.</p>
      </div>
  </body>
  </html>
  `;
}

// Reuse the ioredis instance
const emailQueue = new Queue("emailQueue", { connection: redisConn });

const emailWorker = new Worker<EmailVerificationQueueParams>("emailQueue", async (job: Job) => {
  const expiresAtTimestamp = new Date(Date.now() + 10 * 60000);
  logger.info("here 1");
  const otp = otpGenerator.generateTOTP();
  logger.info("here 2");
  await sessionTokenClass.createSessionToken({ user_id: job.data.userId, token: otp, scope: "EmailVerification", expires_at: expiresAtTimestamp });
  logger.info("here 3");
  const emailContent = emailVerificationTemplate(otp, job.data.userFirstName);
  logger.info("here 4");
  await sender.sendEmail("Email Verification", emailContent, [job.data.userEmailAddr], [], [], []);
  logger.info("here 5");
}, { connection: redisConn });


emailWorker.on("completed", (job: Job) => {
  logger.info(`Email job ${job.id} completed`);
});

emailWorker.on("failed", (job, error) => {
  logger.error(`Email job ${job?.id} failed with error ${error.message}`);
});

emailWorker.on("error", err => {
  logger.error(err.stack);
});

export { emailQueue, emailWorker };