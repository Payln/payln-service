import express, { Router } from "express";
import { completeBusinessCreation, createBusiness, validateCompleteBusinessCreationParams, validateCreateBusinessParams } from "../controllers/business";
import { authenticate, checkAuth } from "../middleware/authorization";


const businessRouter: Router = express.Router();
businessRouter.use(authenticate);

businessRouter
	.route("/")
	.post(checkAuth, validateCreateBusinessParams, createBusiness);

businessRouter
	.route("/complete-business-creation")
	.patch(checkAuth, validateCompleteBusinessCreationParams, completeBusinessCreation);

export default businessRouter;
