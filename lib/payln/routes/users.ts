import express, { Router } from "express";
import { emailVerification, validateEmailVerificationParams, sendEmailVerification, validateSendEmailVerificationParams } from "../controllers/user";


const userRouter: Router = express.Router();

userRouter.post("/email-verification", validateEmailVerificationParams, emailVerification);
userRouter.post("/send-email-verification", validateSendEmailVerificationParams, sendEmailVerification);

export default userRouter;
