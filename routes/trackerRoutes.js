import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import { getTrackerData, getHistoryData } from "../controllers/trackerController.js";

const trackerRouter = express.Router();

trackerRouter.get("/", verifyJWT, getTrackerData);
trackerRouter.get("/history", verifyJWT, getHistoryData);

export default trackerRouter;
