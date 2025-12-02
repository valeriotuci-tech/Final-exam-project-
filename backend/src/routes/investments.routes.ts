import { Router } from "express";
import { body } from "express-validator";
import {
  createInvestment,
  getUserInvestments
} from "../controllers/investments.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validateRequest } from "../utils/validation.utils";

export const investmentsRouter = Router();

investmentsRouter.post(
  "/",
  authenticate,
  [
    body("campaignId").isUUID(),
    body("amount").isFloat({ gt: 0 }),
    body("rewardTier").optional().isString()
  ],
  validateRequest([]),
  createInvestment
);

investmentsRouter.get("/me", authenticate, getUserInvestments);
