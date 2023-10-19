import express, { Router } from "express";
import { signUpUser, signUpUserUser } from "../controllers/auth";


const UsersRouter: Router = express.Router();

UsersRouter
	.route("/")
	.post(signUpUserUser, signUpUser);

export default UsersRouter;
