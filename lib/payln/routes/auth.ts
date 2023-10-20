import express, { Router } from "express";
import { signUpUser, validateSignUpUserParams } from "../controllers/auth";


const authRouter: Router = express.Router();

authRouter.post("/signup", validateSignUpUserParams, signUpUser);

export default authRouter;
