import axios from "axios";
import { check, validationResult } from "express-validator";

export const searchFood = async (req, res) => {
  const { name, page = 0 } = req.query;

  try {
    const response = await axios.get(
      "https://platform.fatsecret.com/rest/server.api",
      {
        headers: {
          Authorization: `Bearer ${req.accessToken}`,
        },
        params: {
          method: "foods.search.v2",
          search_expression: name,
          format: "json",
          max_results: 5,
          page_number: page,
        },
      }
    );

    const output = {
      success: true,
      message: `Success searching for ${name}.`,
      data: [],
    };

    if (response.data.foods_search.results) {
      response.data.foods_search.results.food.forEach((foodItem) => {
        foodItem.servings.serving.forEach((serving) => {
          output.data.push({
            foodId: foodItem.food_id,
            servingId: serving.serving_id,
            foodName: foodItem.food_name,
            servingDescription: serving.serving_description,
            calories: parseFloat(serving.calories),
            carbohydrate: parseFloat(serving.carbohydrate),
            protein: parseFloat(serving.protein),
            fat: parseFloat(serving.fat),
          });
        });
      });
    }

    res.json(output);
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: "Error searching for food",
    });
  }
};

export const detailFood = async (req, res) => {
  const { foodId, servingId } = req.query;

  try {
    const response = await axios.get(
      "https://platform.fatsecret.com/rest/server.api",
      {
        headers: {
          Authorization: `Bearer ${req.accessToken}`,
        },
        params: {
          method: "food.get.v3",
          food_id: foodId,
          format: "json",
        },
      }
    );

    if (response.data.error) {
      return res.status(400).json({
        success: false,
        message: response.data.error.message,
        data: null,
      });
    }

    const { food } = response.data;

    const selectedServing = food.servings.serving.find(
      (item) => item.serving_id === servingId
    );

    if (!selectedServing) {
      return res.status(400).json({
        success: false,
        message: `Serving id '${servingId}' does not exist`,
        data: null,
      });
    }

    const properties = [
      { old: "saturated_fat", new: "saturatedFat" },
      { old: "polyunsaturated_fat", new: "polyunsaturatedFat" },
      { old: "monounsaturated_fat", new: "monounsaturatedFat" },
      { old: "trans_fat", new: "transFat" },
      { old: "cholesterol", new: "cholesterol" },
      { old: "sodium", new: "sodium" },
      { old: "potassium", new: "potassium" },
      { old: "fiber", new: "fiber" },
      { old: "sugar", new: "sugar" },
      { old: "added_sugars", new: "addedSugars" },
      { old: "vitamin_d", new: "vitaminD" },
      { old: "vitamin_a", new: "vitaminA" },
      { old: "vitamin_c", new: "vitaminC" },
      { old: "calcium", new: "calcium" },
      { old: "iron", new: "iron" },
    ];

    const result = {
      foodId: food.food_id,
      servingId: selectedServing.serving_id,
      foodName: food.food_name,
      servingDescription: selectedServing.serving_description,
      calories: parseFloat(selectedServing.calories),
      carbohydrate: parseFloat(selectedServing.carbohydrate),
      protein: parseFloat(selectedServing.protein),
      fat: parseFloat(selectedServing.fat),
    };

    properties.forEach(({ old, new: newName }) => {
      result[newName] =
        selectedServing[old] !== undefined
          ? parseFloat(selectedServing[old])
          : null;
    });

    res.status(200).json({
      success: true,
      message: `Success getting detail for ${food.foodName}.`,
      data: result,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: error.message, data: null });
  }
};

export const addToMealPlan = [
  check("foodId").notEmpty().withMessage("foodId is required."),
  check("servingId").notEmpty().withMessage("servingId is required."),
  check("mealTime").notEmpty().withMessage("mealTime is required."),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        data: { errors: errors.array() },
        message: "Validation errors.",
      });
    }

    const { foodId, servingId, mealTime } = req.body;

    try {
      const existingFood = await prisma.food.findFirst({
        where: {
          foodId: foodId,
          servingId: servingId,
        },
      });

      if (!existingFood) {
        const response = await axios.get(
          "https://platform.fatsecret.com/rest/server.api",
          {
            headers: {
              Authorization: `Bearer ${req.accessToken}`,
            },
            params: {
              method: "food.get.v3",
              food_id: foodId,
              format: "json",
            },
          }
        );

        if (response.data.error) {
          return res.status(400).json({
            success: false,
            message: response.data.error.message,
            data: null,
          });
        }

        const { food } = response.data;

        const selectedServing = food.servings.serving.find(
          (item) => item.serving_id === servingId
        );

        if (!selectedServing) {
          return res.status(400).json({
            success: false,
            message: `Serving id '${servingId}' does not exist`,
            data: null,
          });
        }

        const newFood = await prisma.food.create({
          data: {
            foodId: food.food_id,
            servingId: selectedServing.serving_id,
            foodName: food.food_name,
            servingDescription: selectedServing.serving_description,
            calories: parseFloat(selectedServing.calories),
            protein: parseFloat(selectedServing.protein),
            carbohydrate: parseFloat(selectedServing.carbohydrate),
            fat: parseFloat(selectedServing.fat),
          },
        });

        await prisma.meal.create({
          data: {
            userId: req.user.id,
            foodId: newFood.id,
            mealTime: mealTime,
            type: "RECOMMENDED",
          },
        });
      } else {
        await prisma.meal.create({
          data: {
            userId: req.user.id,
            foodId: existingFood.id,
            mealTime: mealTime,
            type: "RECOMMENDED",
          },
        });
      }

      return res.status(200).json({
        success: true,
        message: "Food added to the meal plan",
        data: null,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
        data: null,
      });
    }
  },
];

export const deleteFromMealPlan = async (req, res) => {
  const { id } = req.query;

  try {
    await prisma.meal.delete({
      where: { id: parseInt(id, 10) },
    });

    res.json({
      success: true,
      message: "Food deleted from the meal plan",
      data: null,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message, data: null });
  }
};

export const updateMealStatus = (status) => async (req, res) => {
  const { id } = req.query;

  try {
    await prisma.meal.update({
      where: { id: parseInt(id, 10) },
      data: { type: status },
    });

    res.json({
      success: true,
      message: `Meal type updated to ${status}`,
      data: null,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message, data: null });
  }
};
