import { Router } from "express";
import { body, param } from "express-validator";
import {
  createRestaurantController,
  getRestaurantsController,
  getRestaurantByIdController,
  updateRestaurantController,
  deleteRestaurantController
} from "../controllers/restaurants.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validateRequest } from "../utils/validation.utils";

export const restaurantsRouter = Router();

restaurantsRouter.get("/", getRestaurantsController);

restaurantsRouter.get(
  "/:id",
  [param("id").isUUID()],
  validateRequest,
  getRestaurantByIdController
);

restaurantsRouter.post(
  "/",
  authenticate,
  [
    body("name").isString().notEmpty(),
    body("description").optional().isString(),
    body("location").optional().isString(),
    body("cuisineType").optional().isString(),
    body("imageUrl").optional().isURL()
  ],
  validateRequest,
  createRestaurantController
);

restaurantsRouter.put(
  "/:id",
  authenticate,
  [param("id").isUUID()],
  validateRequest,
  updateRestaurantController
);

restaurantsRouter.delete(
  "/:id",
  authenticate,
  [param("id").isUUID()],
  validateRequest,
  deleteRestaurantController
);
