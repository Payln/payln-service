/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { InsertParams, insertBusiness } from "../../db/queries/business";
import logger from "../../logger/logger";
import { body, validationResult } from "express-validator";

export const validateCreateBusiness = [
  body("name").trim().isLength({ min: 1 }).withMessage("name is required"),
  body("description").trim().isLength({ min: 1 }).withMessage("description is required"),
  body("email").trim().isEmail().withMessage("Invalid email format"),
  body("profile_image_url").trim().isURL().withMessage("Invalid URL format"),
  body("password").trim().isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
];

export async function createBusiness(req: Request, res: Response) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, email, profile_image_url, password } = req.body;

    const param: InsertParams = {
      name,
      description,
      email,
      profileImageUrl: profile_image_url,
      hashedPassword: password,
    };

    const business = await insertBusiness(param);

    res.status(201).json({
      status: "success",
      data: {
        message: "new business created",
        result: {
          business: business,
        },
      },
    });
  } catch (error: any) {
    // TODO: proper error handling
    logger.error(error.message);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while creating the business",
    });
  }
}
