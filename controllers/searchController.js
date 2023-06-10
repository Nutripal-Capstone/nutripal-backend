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
      const properties = [
        'saturated_fat', 'polyunsaturated_fat', 'monounsaturated_fat', 'trans_fat',
        'cholesterol', 'sodium', 'potassium', 'fiber', 'sugar', 'added_sugars', 
        'vitamin_d', 'vitamin_a', 'vitamin_c', 'calcium', 'iron'
      ];
      
      response.data.foods_search.results.food.forEach((foodItem) => {
        foodItem.servings.serving.forEach((serving) => {
          const data = {
            food_id: foodItem.food_id,
            serving_id: serving.serving_id,
            food_name: foodItem.food_name,
            food_type: foodItem.food_type,
            serving_description: serving.serving_description,
            calories: parseFloat(serving.calories),
            carbohydrate: parseFloat(serving.carbohydrate),
            protein: parseFloat(serving.protein),
            fat: parseFloat(serving.fat),
          };
          
          properties.forEach((prop) => {
            data[prop] = serving[prop] !== undefined ? parseFloat(serving[prop]) : null;
          });
          
          output.data.push(data);
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
