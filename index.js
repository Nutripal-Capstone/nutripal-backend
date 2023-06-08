import dotenv from "dotenv";
dotenv.config();

import express from "express";
import authRouter from "./routes/authRoutes.js";
import trackerRouter from "./routes/trackerRoutes.js";
import prisma from "./config/prisma.js";
import axios from 'axios';

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
app.get('/testing', async (req, res) => {
  try {
    const token = process.env.TOKEN_TEST; // Replace <token> with your actual token
    const apiUrl =
      'https://platform.fatsecret.com/rest/server.api' +
      '?method=recipes.search.v3' +
      '&search_expression=Yogurt' +
      '&format=json' +
      '&max_results=50' +
      '&page_number=0';

    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
