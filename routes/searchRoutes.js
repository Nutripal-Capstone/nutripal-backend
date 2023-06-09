import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import { searchFood } from "../controllers/searchController.js";
import validateAccessToken from "../middleware/validateAccessToken.js";

const searchRouter = express.Router();

searchRouter.get("/food", verifyJWT, validateAccessToken, searchFood);

export default searchRouter;
