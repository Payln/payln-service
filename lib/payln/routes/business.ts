import express, { Router } from "express";
import { createBusiness, validateCreateBusiness } from "../controllers/business";


const businessRouter: Router = express.Router();

businessRouter
	.route("/")
	.post(validateCreateBusiness, createBusiness);

export default businessRouter;
