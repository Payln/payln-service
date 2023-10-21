/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import logger from "../../logger/logger";
import { body, validationResult } from "express-validator";
import businessClass from "../businesses/business";

export const validateCreateBusinessParams = [
  body("name").trim().isLength({ min: 1 }).withMessage("name is required"),
  body("description").trim().isLength({ min: 1 }).withMessage("description is required"),
  body("general_email").trim().isEmail().withMessage("Invalid email format"),
  body("website_url").trim().isURL().withMessage("Invalid URL format"),
];

export async function createBusiness(req: Request, res: Response) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, general_email, website_url } = req.body;
    
    const payload: Payload = res.locals.authenticatePayload;

    const business = await businessClass.insertBusiness(
      payload.user_id, 
      name, 
      description,
      website_url,
      general_email, 
    );
    if (!business) {
      return res.status(500).json({
        status: "error",
        message: "Business creation failed",
      });
    }

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
    logger.error(error.message);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while creating the business",
    });
  }
}
