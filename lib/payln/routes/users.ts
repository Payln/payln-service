import express, { Router } from "express";
import { signUpUser, validateSignUpUser } from "../controllers/auth";


const router: Router = express.Router();

router.post("/auth/signup", validateSignUpUser, signUpUser);

export default router;
