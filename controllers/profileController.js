import prisma from "../config/prisma.js";
import { calculateNutrition } from "../utils/nutritionGoals.js";

export const getProfile = async (req, res) => {
    const userId = req.user.id
    try {
        const user = await prisma.user.findUnique({
            where: {
              id: userId
            },
          });
        res.status(200).json({
            "success": true,
            "data" : user,
            "message" : "Get profile user successfull"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: { error: error.message },
            message: "Error fetching profile data.",
          });
    }
}

export const updateProfile = async (req, res) => {
    const userId = req.user.id
    try {
        const userData = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        const { name, age, weight, height, gender, activityLevel, goal, mealsPerDay} = { ...userData, ...req.body }
        const { calorieGoal, fatGoal, carbohydrateGoal, proteinGoal } =
        calculateNutrition(
            age, height, weight, gender, activityLevel, goal
        );
        await prisma.nutritionGoal.create({
            where: {userId: userId},
            data: {
              calorieGoal, fatGoal, proteinGoal, carbohydrateGoal
            },
          });
        const user = await prisma.user.update({
            where:{id: userId},
            data: { name, age, weight, height, gender, activityLevel, goal, mealsPerDay }
        })
        res.status(200).json({
            "success": true,
            "data" : user,
            "message" : "Update profile user successfull"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: { error: error.message },
            message: "Error update profile data.",
          });
    }
}