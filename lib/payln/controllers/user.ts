/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import UserClass from "../users/users";
import logger from "../../logger/logger";
import sessionTokenClass from "../session_tokens/session_tokens";
import { afterTime } from "../../utils/random";
import userClass from "../users/users";
import { deleteSessionTokenQueue } from "../../bg_workers/delete_session_token";
import pasetoMaker from "../../paseto_token/paseto";
import { emailQueue } from "../../bg_workers/send_email_worker";

export const validateEmailVerificationParams = [
  body("otp").trim().isLength({ min: 6 }).withMessage("otp must be a minimum of 6 characters"),
  body("user_id")
    .trim()
    .custom((value) => {
      if (parseInt(value) === 0) {
        throw new Error("user_id cannot be zero");
      }
      return true;
    }),
];

export async function emailVerification(req: Request, res: Response) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { otp, user_id } = req.body;
    const session = await sessionTokenClass.getASessionToken(otp, "EmailVerification", user_id);

    if (!session) {
      return res.status(404).json({
        status: "error",
        error: {
          message: "Invalid OTP or user ID provided.",
        }
      });
    }

    if (afterTime(session.expires_at)) {
      return res.status(401).json({
        status: "error",
        error: {
          message: "Provided OTP has expired.",
        }
      });
    }

    const updatedUser = await userClass.updateUser(user_id, null, null, null, null, true);
    if (!updatedUser) {
      return res.status(404).json({
        status: "error",
        error: {
          message: "Invalid User ID provided.",
        }
      });
    }

    const job = await deleteSessionTokenQueue.add("delete_session_token", {
      sessionTokenId: session.id
    });
    logger.info(`Background task with id ${job.id} enqueued`);

    const { token } = await pasetoMaker.createToken(updatedUser.id, updatedUser.email, 25, null);

    return res.status(201).json({
      status: "success",
      data: {
        message: "User's email verified successfully.",
        result: {
          user: UserClass.scrubUserData(updatedUser),
          access_token: token,
        },
      },
    });

  } catch (error: any) {
    logger.error(error.message);
    return res.status(500).json({
      status: "error",
      error: {
        message: "An error occurred while verifying user's email",
      }
    });
  }
}

export const validateSendEmailVerificationParams = [
  body("email").trim().isEmail().withMessage("Invalid email format"),
];

export async function sendEmailVerification(req: Request, res: Response) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    const user = await userClass.getUser(null, email);
    if (!user) {
      return res.status(404).json({
        status: "error",
        error: {
          message: "User not found",
        }
      });
    }

    if (user.is_email_verified) {
      return res.status(200).json({
        status: "info",
        message: "User email is already verified. Login user instead",
      });
    }

    const job = await emailQueue.add("send_email_verification", {
      userId: user.id,
      userFirstName: user.first_name,
      userEmailAddr: user.email
    });
    logger.info(`Background task with id ${job.id} enqueued`);

    return res.status(201).json({
      status: "success",
      data: {
        message: "email verification send",
      },
    });
  } catch (error: any) {
    logger.error(error.message);
    return res.status(500).json({
      status: "error",
      error: {
        message: "An error occurred while creating the user",
      }
    });
  }
}