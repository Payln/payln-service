/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import UserClass from "../users/users";
import logger from "../../logger/logger";
import { emailQueue } from "../../bg_workers/send_email_worker";
import userClass from "../users/users";
import { checkPassword } from "../../utils/password";
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
        error: {
          message: "User creation failed",
        }
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
      error: {
        message: "An error occurred while creating the user",
      }
    });
  }
}



export const validateLoginUserParams = [
  body("email").trim().isEmail().withMessage("Invalid email format"),
  body("password").trim().isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
];

export async function loginUser(req: Request, res: Response) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await userClass.getUser(null, email);
    if (!user) {
      return res.status(401).json({
        status: "error",
        error: {
          message: "Email or password is wrong",
        }
      });
    }

    const correct = await checkPassword(password, user.hashed_password);
    if (!correct) {
      return res.status(401).json({
        status: "error",
        error: {
          message: "Email or password is wrong",
        }
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        status: "error",
        error: {
          message: "Your account is inactive. Please contact PayLN support to activate your account.",
        }
      });
    }

    if (!user.is_email_verified) {
      const job = await emailQueue.add("send_email_verification", {
        userId: user.id, 
        userFirstName: user.first_name, 
        userEmailAddr: user.email
      });
      logger.info(`Background task with id ${job.id} enqueued`);

      return res.status(200).json({
        status: "info",
        data: {
          message: "An email verification link has been sent. Please check your email.",
        },
      });
    }

    const { token } = await pasetoMaker.createToken(user.id, user.email, 25, null);

    return res.status(200).json({
      status: "success",
      data: {
        message: "login successful.",
        result: {
          user: UserClass.scrubUserData(user),
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
