/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import UserClass from "../users/users";
import logger from "../../logger/logger";

export const validateCreateUser = [
  body("first_name").trim().isLength({ min: 1 }).withMessage("first_name is required"),
  body("last_name").trim().isLength({ min: 1 }).withMessage("last_name is required"),
  body("email").trim().isEmail().withMessage("Invalid email format"),
  body("password").trim().isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
];

export async function createUser(req: Request, res: Response) {
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
    res.status(201).json({
      status: "success",
      data: {
        message: "new user created",
        result: {
          business: UserClass.scrubUserData(user),
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