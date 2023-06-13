import dotenv from "dotenv";
dotenv.config();

import express from "express";
import authRouter from "./routes/authRoutes.js";
import trackerRouter from "./routes/trackerRoutes.js";
import prisma from "./config/prisma.js";
import profileRouter from "./routes/profileRoutes.js";
import foodRouter from "./routes/foodRoutes.js";

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.get("/", async(req, res) => {
  try {
    await prisma.$connect();
    res.status(200).json({
      "message" : "Hello Nutripal User! Database Connection Successful"
    })
  } catch (error) {
    console.error(error)
  }
});
app.use("/auth", authRouter);
app.use("/tracker", trackerRouter);
app.use("/profile", profileRouter);
app.use("/food", foodRouter);

app.listen(PORT, () =>
  console.log(`Server is running on port :${PORT}`)
);
