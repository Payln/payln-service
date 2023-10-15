/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";

// Define a type for the asynchronous function that will be wrapped
type AsyncHandlerFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

// Middleware function that wraps asynchronous route handlers
const asyncMiddleware = (fn: AsyncHandlerFunction) => {
	return (req: Request, res: Response, next: NextFunction) => {
		fn(req, res, next).catch(next);
	};
};

export default asyncMiddleware;
