import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import {
  searchFood,
  detailFood,
  addToMealPlan,
  updateMealStatus,
  deleteFromMealPlan,
} from "../controllers/foodController.js";
import validateAccessToken from "../middleware/validateAccessToken.js";

const foodRouter = express.Router();

foodRouter.get("/search", verifyJWT, validateAccessToken, searchFood);
foodRouter.get("/detail", verifyJWT, validateAccessToken, detailFood);
foodRouter.post("/mealPlan", verifyJWT, validateAccessToken, addToMealPlan);
foodRouter.delete("/mealPlan", verifyJWT, validateAccessToken, deleteFromMealPlan);
foodRouter.post("/eaten", verifyJWT, validateAccessToken, updateMealStatus("EATEN"));
foodRouter.delete("/eaten", verifyJWT, validateAccessToken, updateMealStatus("RECOMMENDED"));

export default foodRouter;
