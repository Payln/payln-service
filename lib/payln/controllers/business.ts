/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { InsertParams, insertBusiness } from "../../db/queries/business";
import logger from "../../logger/logger";

export async function createBusiness(req: Request, res: Response) {
  try {
   const { about, email, profileImageUrl, hashedPassword } = req.body;

   const param: InsertParams = {
     about,
     email,
     profileImageUrl,
     hashedPassword,
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
    logger.error(error.message);
    return res.status(500).json({
    status: "error",
    message: "An error occurred while creating the business",
  });
  }
}
