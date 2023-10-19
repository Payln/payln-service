import express, { Router } from "express";
import { createUser, validateCreateUser } from "../controllers/auth";


const UsersRouter: Router = express.Router();

UsersRouter
	.route("/")
	.post(validateCreateUser, createUser);

export default UsersRouter;
