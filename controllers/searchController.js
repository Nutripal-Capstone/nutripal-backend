import axios from "axios";

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
            food_id: foodItem.food_id,
            serving_id: serving.serving_id,
            food_name: foodItem.food_name,
            food_type: foodItem.food_type,
            serving_description: serving.serving_description,
            calories: serving.calories,
            carbohydrate: serving.carbohydrate,
            protein: serving.protein,
            fat: serving.fat,
            saturated_fat: serving.saturated_fat,
            polyunsaturated_fat: serving.polyunsaturated_fat,
            monounsaturated_fat: serving.monounsaturated_fat,
            trans_fat: serving.trans_fat,
            cholesterol: serving.cholesterol,
            sodium: serving.sodium,
            potassium: serving.potassium,
            fiber: serving.fiber,
            sugar: serving.sugar,
            added_sugars: serving.added_sugars,
            vitamin_d: serving.vitamin_d,
            vitamin_a: serving.vitamin_a,
            vitamin_c: serving.vitamin_c,
            calcium: serving.calcium,
            iron: serving.iron,
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
