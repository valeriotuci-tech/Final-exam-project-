import { Router } from "express";
import { body, param } from "express-validator";
import {
  createCampaignController,
  getCampaignsController,
  getCampaignByIdController,
  updateCampaignController,
  deleteCampaignController
} from "../controllers/campaigns.controller";
import { validateRequest } from "../utils/validation.utils";
import { authenticate } from "../middleware/auth.middleware";

export const campaignsRouter = Router();

campaignsRouter.get("/", getCampaignsController);

campaignsRouter.get(
  "/:id",
  [param("id").isUUID()],
  validateRequest,
  getCampaignByIdController
);

campaignsRouter.post(
  "/",
  authenticate,
  [
    body("restaurantId").isUUID(),
    body("title").isString().notEmpty(),
    body("targetAmount").isFloat({ gt: 0 }),
    body("startDate").isISO8601(),
    body("endDate").isISO8601()
  ],
  validateRequest,
  createCampaignController
);

campaignsRouter.put(
  "/:id",
  authenticate,
  [param("id").isUUID()],
  validateRequest,
  updateCampaignController
);

campaignsRouter.delete(
  "/:id",
  authenticate,
  [param("id").isUUID()],
  validateRequest,
  deleteCampaignController
);
