import { Router } from "express";
import { body, param } from "express-validator";
import {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign
} from "../controllers/campaigns.controller";
import { validateRequest } from "../utils/validation.utils";
import { authenticate } from "../middleware/auth.middleware";

export const campaignsRouter = Router();

campaignsRouter.get("/", getAllCampaigns);

campaignsRouter.get(
  "/:id",
  [param("id").isUUID()],
  validateRequest([]),
  getCampaignById
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
  validateRequest([]),
  createCampaign
);

campaignsRouter.put(
  "/:id",
  authenticate,
  [param("id").isUUID()],
  validateRequest([]),
  updateCampaign
);

campaignsRouter.delete(
  "/:id",
  authenticate,
  [param("id").isUUID()],
  validateRequest([]),
  deleteCampaign
);
