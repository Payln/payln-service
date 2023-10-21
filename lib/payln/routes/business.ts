import express, { Router } from "express";
import { createBusiness, validateCreateBusinessParams } from "../controllers/business";
import { authenticate } from "../middleware/authorization";


const businessRouter: Router = express.Router();
businessRouter.use(authenticate);

businessRouter
	.route("/")
	.post(validateCreateBusinessParams, createBusiness);

export default businessRouter;
