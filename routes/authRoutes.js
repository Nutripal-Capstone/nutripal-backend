import express from "express";
import { login, register } from "../controllers/authController.js";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";

const authRouter = express.Router();

authRouter.post("/login", verifyFirebaseToken, login);
authRouter.post("/register", verifyFirebaseToken, register);

export default authRouter;
