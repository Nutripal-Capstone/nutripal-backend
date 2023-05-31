import express from "express";
import { login } from "../controllers/authController.js";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";

const authRouter = express.Router();

authRouter.post("/login", verifyFirebaseToken, login);

export default authRouter;
