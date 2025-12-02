import { Router } from "express";
import { body } from "express-validator";
import {
  register,
  login,
  refreshToken,
  getProfile,
  updateProfile
} from "../controllers/auth.controller";
import { validateRequest } from "../utils/validation.utils";

export const authRouter = Router();

authRouter.post(
  "/register",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 8 }),
    body("name").isString().notEmpty()
  ],
  validateRequest([]),
  register
);

authRouter.post(
  "/login",
  [body("email").isEmail(), body("password").isString().notEmpty()],
  validateRequest([]),
  login
);

authRouter.post("/refresh", refreshToken);
