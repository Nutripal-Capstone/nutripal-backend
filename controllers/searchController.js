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
            serving_description: serving.serving_description,
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
  const { food_id, serving_id } = req.query;

  try {

    const response = await axios.get(
      "https://platform.fatsecret.com/rest/server.api",
      {
        headers: {
          Authorization: `Bearer ${req.accessToken}`,
        },
        params: {
          method: "food.get.v3",
          food_id: food_id,
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
      (item) => item.serving_id === serving_id
    );

    if (!selectedServing) {
      return res.status(400).json({
        success: false,
        message: `Serving id '${serving_id}' does not exist`,
        data: null,
      });
    }

    const properties = [
      "saturated_fat",
      "polyunsaturated_fat",
      "monounsaturated_fat",
      "trans_fat",
      "cholesterol",
      "sodium",
      "potassium",
      "fiber",
      "sugar",
      "added_sugars",
      "vitamin_d",
      "vitamin_a",
      "vitamin_c",
      "calcium",
      "iron",
    ];

    const result = {
      food_id: food.food_id,
      serving_id: selectedServing.serving_id,
      food_name: food.food_name,
      food_type: food.food_type,
      serving_description: selectedServing.measurement_description,
      calories: parseFloat(selectedServing.calories),
      carbohydrate: parseFloat(selectedServing.carbohydrate),
      protein: parseFloat(selectedServing.protein),
      fat: parseFloat(selectedServing.fat),
    };

    properties.forEach((prop) => {
      result[prop] =
        selectedServing[prop] !== undefined
          ? parseFloat(selectedServing[prop])
          : null;
    });

    res.status(200).json({
      success: true,
      message: `Success getting detail for ${food.food_name}.`,
      data: result,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: error.message, data: null });
  }
};
