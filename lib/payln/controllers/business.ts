/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import logger from "../../logger/logger";
import { body, param, validationResult } from "express-validator";
import businessClass from "../businesses/business";

export const validateCreateBusinessParams = [
  body("name").trim().isLength({ min: 1 }).withMessage("name is required"),
  body("description").trim().isLength({ min: 1 }).withMessage("description is required"),
  body("general_email").trim().isEmail().withMessage("Invalid email format"),
  body("website_url").trim().isURL().withMessage("Invalid URL format"),
];

// createBusiness maps to endpoint "POST /businesses"
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
        error: {
          message: "Business creation failed",
        }
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
      error: {
        message: "An error occurred while creating the business",
      }
    });
  }
}

export const validateCompleteBusinessCreationParams = [
  body("business_id")
    .trim()
    .isUUID(4)
    .withMessage("Invalid business_id format. It must be a UUID (version 4)."),

  body("phone_number")
    .trim()
    .isMobilePhone("any", { strictMode: false })
    .withMessage("Invalid phone number format"),

  body("dispute_email")
    .trim()
    .isEmail()
    .withMessage("Invalid dispute_email format"),

  body("address")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Address is required"),

  body("city")
    .trim()
    .isLength({ min: 1 })
    .withMessage("City is required"),

  body("state")
    .trim()
    .isLength({ min: 1 })
    .withMessage("State is required"),

  body("postal_code")
    .trim()
    .isPostalCode("any")
    .withMessage("Invalid postal code format"),

  body("country")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Country is required"),
];

// completeBusinessCreation maps to endpoint "PATCH /businesses/complete-business-creation"
export async function completeBusinessCreation(req: Request, res: Response) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const payload: Payload = res.locals.authenticatePayload;

    const {
      business_id,
      phone_number,
      dispute_email,
      address,
      city,
      state,
      postal_code,
      country,
    } = req.body;

    const business = await businessClass.completeBusinessDetails(
      business_id,
      payload.user_id,
      phone_number,
      dispute_email,
      address,
      city,
      state,
      postal_code,
      country
    );

    if (!business) {
      return res.status(500).json({
        status: "error",
        error: {
          message: "Failed to update business details.",
        }
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        message: "Business successfully updated.",
        result: {
          business: business,
        },
      },
    });
  } catch (error: any) {
    logger.error(error.message);
    return res.status(500).json({
      status: "error",
      error: {
        message: "An error occurred while updating business details.",
      }
    });
  }
}

// Validation for updating a business with partial data
export const validateUpdateBusinessParams = [
  param("business_id")
    .isUUID(4)
    .withMessage("Invalid business_id format. It must be a UUID (version 4)."),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("name is required"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("description is required"),

  body("general_email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Invalid email format"),

  body("website_url")
    .optional()
    .trim()
    .isURL()
    .withMessage("Invalid URL format"),

  body("phone_number")
    .optional()
    .trim()
    .isMobilePhone("any", { strictMode: false })
    .withMessage("Invalid phone number format"),

  body("dispute_email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Invalid dispute_email format"),

  body("address")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Address is required"),

  body("city")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("City is required"),

  body("state")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("State is required"),

  body("postal_code")
    .optional()
    .trim()
    .isPostalCode("any")
    .withMessage("Invalid postal code format"),

  body("country")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Country is required"),
];

// updateBusiness maps to endpoint "PATCH /businesses/{business_id}"
export async function updateBusiness(req: Request, res: Response) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const payload: Payload = res.locals.authenticatePayload;

    const {
      name,
      description,
      website_url,
      general_email,
      phone_number,
      dispute_email,
      address,
      city,
      state,
      postal_code,
      country,
    } = req.body;

    const businessId = req.params.business_id;

    const business = await businessClass.updateBusiness(
      businessId,
      payload.user_id,
      name,
      description,
      general_email,
      website_url,
      phone_number,
      dispute_email,
      address,
      city,
      state,
      postal_code,
      country
    );

    if (!business) {
      return res.status(500).json({
        status: "error",
        error: {
          message: "Failed to update business details.",
        }
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        message: "Business successfully updated.",
        result: {
          business: business,
        },
      },
    });
  } catch (error: any) {
    logger.error(error.message);
    return res.status(500).json({
      status: "error",
      error: {
        message: "An error occurred while updating business details.",
      }
    });
  }
}

// Validation for business_id.
export const validateGetBusinessParams = [
  param("business_id")
    .isUUID(4)
    .withMessage("Invalid business_id format. It must be a UUID (version 4)."),
];

// getBusiness maps to endpoint "GET /businesses/{business_id}"
export async function getBusiness(req: Request, res: Response) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const payload: Payload = res.locals.authenticatePayload;

    const business = await businessClass.getBusinessByOwner(
      payload.user_id,
    );

    if (!business) {
      return res.status(500).json({
        status: "error",
        error: {
          message: "Failed to get business details.",
        }
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        message: "Found the business.",
        result: {
          business: business,
        },
      },
    });
  } catch (error: any) {
    logger.error(error.message);
    return res.status(500).json({
      status: "error",
      error: {
        message: "An error occurred while getting business details.",
      }
    });
  }
}
