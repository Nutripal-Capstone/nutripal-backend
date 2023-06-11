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
  const { food_id, recipe_id } = req.query;

  try {
    const response = await axios.get(
      `https://platform.fatsecret.com/rest/server.api?method=food.get.v3&food_id=${food_id}`,
      {
        headers: { Authorization: `Bearer ${req.accessToken}` },
      }
    );

    const { data } = response;
    const {
      servings: { serving },
    } = data;

    const selectedServing = serving.find(
      (item) => item.serving_id === recipe_id
    );

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

    let result = null;

    if (selectedServing) {
      result = {
        food_id: data.food_id,
        serving_id: selectedServing.serving_id,
        food_name: data.food_name,
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
    }

    res.status(200).json({
      success: true,
      message: `Success getting detail for ${data.food_name}.`,
      data: result,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error getting food detail.",
        data: null,
      });
  }
};
