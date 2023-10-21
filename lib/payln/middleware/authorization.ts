/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import pasetoMaker from "../../paseto_token/paseto";
import userClass from "../users/users";
import { checkInRedis } from "../../cache/cache";
import logger from "../../logger/logger";

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        status: "error",
        data: {
          message: "You are not logged in! Please log in to get access."
        }
      });
    }

    const payload = await pasetoMaker.verifyToken(token);

    const user = await userClass.getUser(payload.user_id, null);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    if (new Date(user.password_changed_at) > new Date(payload.iat)) {
      return res.status(401).json({
        status: "error",
        data: {
          message: "User recently changed password! Please log in again."
        }
      });
    }

    const isBlacklisted = await checkInRedis(payload.id);
    if (isBlacklisted) {
      return res.status(401).json({
        status: "info",
        message: "invalid token",
      });
    }

    res.locals.userPayload = payload;
    next();
  } catch (error: any) {
    logger.error(error.message);
    return res.status(500).json({
      status: "error",
      message: "An error occurred authenticating the user",
    });
  }
}