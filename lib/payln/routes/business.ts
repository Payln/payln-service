import express, { Router } from "express";
import { createBusiness } from "../controllers/business";


const businessRouter: Router = express.Router();

businessRouter
	.route("/")
	.post(createBusiness);

export default businessRouter;
