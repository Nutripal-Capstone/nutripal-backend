import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import { getTrackerData } from "../controllers/trackerController.js";

const trackerRouter = express.Router();

trackerRouter.get("/data", verifyJWT, getTrackerData);

export default trackerRouter;