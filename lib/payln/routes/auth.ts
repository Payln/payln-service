import express, { Router } from "express";
import { signUpUser, validateSignUpUserParams, validateLoginUserParams, loginUser } from "../controllers/auth";


const authRouter: Router = express.Router();

authRouter.post("/signup", validateSignUpUserParams, signUpUser);
authRouter.post("/login", validateLoginUserParams, loginUser);

export default authRouter;
