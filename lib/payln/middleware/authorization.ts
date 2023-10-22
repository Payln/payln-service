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
        error: {
          message: "You are not logged in! Please log in to get access."
        }
      });
    }

    let payload;
    try {
      payload = await pasetoMaker.verifyToken(token);
    } catch (error: any) {
      return res.status(401).json({
        status: "error",
        error: {
          message: error.message,
        }
      });
    }

    const user = await userClass.getUser(payload.user_id, null);
    if (!user) {
      return res.status(404).json({
        status: "error",
        error: {
          message: "User not found",
        }
      });
    }

    if (new Date(user.password_changed_at) > new Date(payload.iat)) {
      return res.status(401).json({
        status: "error",
        error: {
          message: "User recently changed password! Please log in again."
        }
      });
    }

    const isBlacklisted = await checkInRedis(payload.id);
    if (isBlacklisted) {
      return res.status(401).json({
        status: "error",
        error: {
          message: "invalid token",
        }
      });
    }

    res.locals.authenticatePayload = payload;
    next();
  } catch (error: any) {
    logger.error(error.message);
    return res.status(500).json({
      status: "error",
      error: {
        message: "An error occurred authenticating the user",
      }
    });
  }
}

export function checkAuth(req: Request, res: Response, next: NextFunction) {
  if (!res.locals.authenticatePayload) {
    return res.status(401).json({
      status: "error",
      error: {
        message: "Unauthorized access. Please log in.",
      }
    });
  }
  next();
}