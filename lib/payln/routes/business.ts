import express, { Router } from "express";
import { completeBusinessCreation, createBusiness, getBusiness, updateBusiness, validateCompleteBusinessCreationParams, validateCreateBusinessParams, validateGetBusinessParams, validateUpdateBusinessParams } from "../controllers/business";
import { authenticate, checkAuth } from "../middleware/authorization";


const businessRouter: Router = express.Router();
businessRouter.use(authenticate);

businessRouter
	.route("/")
	.post(checkAuth, validateCreateBusinessParams, createBusiness);

businessRouter
	.route("/complete-business-creation")
	.patch(checkAuth, validateCompleteBusinessCreationParams, completeBusinessCreation);

businessRouter
	.route("/:business_id")
	.patch(checkAuth, validateUpdateBusinessParams, updateBusiness)
	.get(checkAuth, validateGetBusinessParams, getBusiness);

export default businessRouter;
