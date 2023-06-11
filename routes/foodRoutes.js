import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import { searchFood, detailFood } from "../controllers/searchController.js";
import validateAccessToken from "../middleware/validateAccessToken.js";

const foodRouter = express.Router();

foodRouter.get("/search", verifyJWT, validateAccessToken, searchFood);
foodRouter.get("/detail", verifyJWT, validateAccessToken, detailFood);

export default foodRouter;
