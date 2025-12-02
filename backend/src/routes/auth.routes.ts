import { Router } from "express";
import { body } from "express-validator";
import {
  registerController,
  loginController,
  logoutController,
  refreshTokenController
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
  validateRequest,
  registerController
);

authRouter.post(
  "/login",
  [body("email").isEmail(), body("password").isString().notEmpty()],
  validateRequest,
  loginController
);

authRouter.post("/logout", logoutController);

authRouter.post("/refresh", refreshTokenController);
