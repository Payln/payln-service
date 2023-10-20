/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import UserClass from "../users/users";
import logger from "../../logger/logger";
import { emailQueue } from "../../bg_workers/send_email_worker";
import sessionTokenClass from "../session_tokens/session_tokens";
import { afterTime } from "../../utils/random";
import userClass from "../users/users";
import { deleteSessionTokenQueue } from "../../bg_workers/delete_session_token";
import pasetoMaker from "../../paseto_token/paseto";

export const validateSignUpUserParams = [
  body("first_name").trim().isLength({ min: 1 }).withMessage("first_name is required"),
  body("last_name").trim().isLength({ min: 1 }).withMessage("last_name is required"),
  body("email").trim().isEmail().withMessage("Invalid email format"),
  body("password").trim().isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
];

export async function signUpUser(req: Request, res: Response) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {first_name, last_name, email, password} = req.body;

    const params: CreateUserParams = {
      firstName: first_name,
      lastName: last_name,
      email,
      password,
    };

    const user: IUser | undefined = await UserClass.createUser(params);

    if (!user) {
      // Handle the case where user is undefined
      return res.status(500).json({
        status: "error",
        message: "User creation failed",
      });
    }

    const job = await emailQueue.add("send_email_verification", {
      userId: user.id, 
      userFirstName: user.first_name, 
      userEmailAddr: user.email
    });
    logger.info(`Background task with id ${job.id} enqueued`);

    res.status(201).json({
      status: "success",
      data: {
        message: "new user created",
        result: {
          user: UserClass.scrubUserData(user),
        },
      },
    });
  } catch (error: any) {
    logger.error(error.message);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while creating the user",
    });
  }
}

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
        message: "Invalid OTP or user ID provided.",
      });
    }

     if (afterTime(session.expires_at)) {
      return res.status(401).json({
        status: "error",
        message: "Provided OTP has expired.",
      });
     }

     const updatedUser = await userClass.updateUser(user_id, null, null, null, null, true);
     if (!updatedUser) {
      return res.status(404).json({
        status: "error",
        message: "Invalid User ID provided.",
      });
    }

    const job = await deleteSessionTokenQueue.add("delete_session_token", {
      sessionTokenId: session.id
    });
    logger.info(`Background task with id ${job.id} enqueued`);

    const { token } = await pasetoMaker.createToken(updatedUser.id, updatedUser.email, 25, null);

    res.status(201).json({
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
      message: "An error occurred while verifying user's email",
    });
  }
}