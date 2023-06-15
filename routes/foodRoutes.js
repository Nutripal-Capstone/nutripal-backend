import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import {
  searchFood,
  detailFood,
  addToMealPlan,
  updateMealStatus,
  deleteFromMealPlan,
  recommendMeal
} from "../controllers/foodController.js";
import validateAccessToken from "../middleware/validateAccessToken.js";

const foodRouter = express.Router();

foodRouter.get("/search", verifyJWT, validateAccessToken, searchFood);
foodRouter.get("/detail", verifyJWT, validateAccessToken, detailFood);
foodRouter.post("/mealPlan", verifyJWT, validateAccessToken, addToMealPlan);
foodRouter.delete("/mealPlan", verifyJWT, deleteFromMealPlan);
foodRouter.post("/eaten", verifyJWT, updateMealStatus("EATEN"));
foodRouter.delete("/eaten", verifyJWT, updateMealStatus("RECOMMENDED"));
foodRouter.get("/recommend", verifyJWT, recommendMeal);

export default foodRouter;
