import express, { Router } from "express";
import { signUpUser, validateSignUpUser } from "../controllers/auth";


const authRouter: Router = express.Router();

authRouter.post("/signup", validateSignUpUser, signUpUser);

export default authRouter;
