import prisma from "../config/prisma.js";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import { calculateNutrition } from "../utils/nutritionGoals.js";

export const login = async (req, res) => {
  const uid = req.user.uid;

  const user = await prisma.user.findUnique({
    where: {
      firebaseId: uid,
    },
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      data: null,
      message: "User is not yet registered.",
    });
  }

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

  return res.status(200).json({
    success: true,
    data: {
      token,
    },
    message: "Login successful.",
  });
};

export const register = [
  check("name").notEmpty().withMessage("Name is required."),
  check("height").isInt().withMessage("Must be int."),
  check("weight").isInt().withMessage("Must be int."),
  check("gender").isIn(["M", "F"]).withMessage("Invalid value."),
  check("age").isInt().withMessage("Must be int."),
  check("activityLevel").isIn(["SD", "LA", "MA", "VA", "SA"]).withMessage("Invalid value."),
  check("goal").isIn(["LW", "MW", "GW"]).withMessage("Invalid value."),
  check("mealsPerDay").isInt().withMessage("Must be int."),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        data: { errors: errors.array() },
        message: "Validation errors.",
      });
    }

    const {
      uid,
      firebase: { sign_in_provider: provider },
      email,
      picture,
    } = req.user;

    const { name, height, weight, gender, age, activityLevel, goal, mealsPerDay } = req.body;

    try {
      const newUser = await prisma.user.create({
        data: {
          firebaseId: uid,
          name,
          height,
          weight,
          gender,
          age,
          activityLevel,
          goal,
          email,
          provider,
          picture,
          mealsPerDay
        },
      });

      const { calorieGoal, fatGoal, carbohydrateGoal, proteinGoal } =
        calculateNutrition(
          newUser.age,
          newUser.height,
          newUser.weight,
          newUser.gender,
          newUser.activityLevel,
          newUser.goal
        );

      await prisma.nutritionGoal.create({
        data: {
          userId: newUser.id,
          calorieGoal: calorieGoal,
          proteinGoal: proteinGoal,
          carbohydrateGoal: carbohydrateGoal,
          fatGoal: fatGoal,
        },
      });

      const payload = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });

      return res.status(201).json({
        success: true,
        data: token,
        message: "User registered successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        data: { error: error.message },
        message: "Error registering user.",
      });
    }
  },
];
