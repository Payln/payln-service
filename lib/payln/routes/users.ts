import express, { Router } from "express";
import { emailVerification, validateEmailVerificationParams } from "../controllers/user";


const userRouter: Router = express.Router();

userRouter.post("/email-verification", validateEmailVerificationParams, emailVerification);

export default userRouter;
