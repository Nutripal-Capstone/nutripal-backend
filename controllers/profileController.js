import prisma from "../config/prisma.js";
import { calculateNutrition } from "../utils/nutritionGoals.js";

export const getProfile = async (req, res) => {
  const uid = req.user.uid;
  try {
    const user = await prisma.user.findUnique({
      where: {
        firebaseId: uid,
      },
    });
    res.status(200).json({
      success: true,
      data: user,
      message: "Get profile user successfull",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: { error: error.message },
      message: "Error fetching profile data.",
    });
  }
};

export const updateProfile = async (req, res) => {
  const uid = req.user.uid;
  const allowedParameters = [
    "name",
    "age",
    "weight",
    "height",
    "gender",
    "activityLevel",
    "goal",
    "dietType",
    "mealsPerDay"
  ];
  try {
    const keys = Object.keys(req.body);
    const isUpdateAllowed = keys.every((key) =>
      allowedParameters.includes(key)
    );

    if (!isUpdateAllowed) {
      return res.status(400).json({
        success: false,
        data: {
          error:
            "Invalid input parameters. Only updates to name, age, weight, height, gender, activityLevel, goal, dietType are allowed.",
        },
        message: "Error updating profile data.",
      });
    }

    const userData = await prisma.user.findUnique({
      where: {
        firebaseId: uid,
      },
    });
    const { age, weight, height, gender, activityLevel, goal, dietType } = {
      ...userData,
      ...req.body,
    };
    // Check if the params includes name or mealsPerDay it'll not create new NutritionGoal
    const calculationParameter = allowedParameters.filter(p => p!== "name" && p!== "mealsPerDay")
    if (calculationParameter.find((parameter) => Object.keys(req.body).includes(parameter))) {
      const { calorieGoal, fatGoal, carbohydrateGoal, proteinGoal } =
        calculateNutrition(
          age,
          height,
          weight,
          gender,
          activityLevel,
          goal,
          dietType
        );
      await prisma.nutritionGoal.create({
        data: {
          userId: userData.id,
          calorieGoal,
          fatGoal,
          proteinGoal,
          carbohydrateGoal,
        },
      });
    }
    const user = await prisma.user.update({
      where: { firebaseId: uid },
      data: req.body,
    });
    res.status(200).json({
      success: true,
      data: user,
      message: "Update profile user successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: { error: error.message },
      message: "Error update profile data.",
    });
  }
};
