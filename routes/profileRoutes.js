import express from "express";
import {getProfile, updateProfile} from "../controllers/profileController.js";

const profileRouter = express.Router();

profileRouter.get("/", getProfile);
profileRouter.put("/", updateProfile);

export default profileRouter;