import express from "express";
import {getProfile, updateProfile} from "../controllers/profileController.js";
import verifyJWT from "../middleware/verifyJWT.js";

const profileRouter = express.Router();

profileRouter.get("/", verifyJWT, getProfile);
profileRouter.put("/", updateProfile);

export default profileRouter;