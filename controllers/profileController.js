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
    const parameters = ["age", "weight", "height", "gender", "activityLevel", "goal"]
    try {
        const userData = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        const { age, weight, height, gender, activityLevel, goal} = { ...userData, ...req.body }
        if(parameters.find(parameter => Object.keys(req.body).includes(parameter))){
            const { calorieGoal, fatGoal, carbohydrateGoal, proteinGoal } =
            calculateNutrition(
                age, height, weight, gender, activityLevel, goal
            );
            await prisma.nutritionGoal.create({
                data: {
                  userId, calorieGoal, fatGoal, proteinGoal, carbohydrateGoal
                },
              });
        }
        const user = await prisma.user.update({
            where:{id: userId},
            data: req.body
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