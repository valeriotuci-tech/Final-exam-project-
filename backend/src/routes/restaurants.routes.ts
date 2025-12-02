import { Router } from "express";
import { body, param } from "express-validator";
import {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant
} from "../controllers/restaurants.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validateRequest } from "../utils/validation.utils";

export const restaurantsRouter = Router();

restaurantsRouter.get("/", getAllRestaurants);

restaurantsRouter.get(
  "/:id",
  [param("id").isUUID()],
  validateRequest([]),
  getRestaurantById
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
  validateRequest([]),
  createRestaurant
);

restaurantsRouter.put(
  "/:id",
  authenticate,
  [param("id").isUUID()],
  validateRequest([]),
  updateRestaurant
);

restaurantsRouter.delete(
  "/:id",
  authenticate,
  [param("id").isUUID()],
  validateRequest([]),
  deleteRestaurant
);
