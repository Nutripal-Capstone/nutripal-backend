import moment from "moment-timezone";

export const getTrackerData = async (req, res) => {
  let startDate = moment().tz("Asia/Jakarta").startOf("day").toDate();
  let endDate = moment().tz("Asia/Jakarta").endOf("day").toDate();

  const userId = req.user.id;
  try {
    const [nutritionGoal, meals] = await Promise.all([
      prisma.nutritionGoal.findFirst({
        where: {
          userId,
          createdAt: {
            lte: endDate,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.meal.findMany({
        where: {
          userId,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          food: true,
        },
      }),
    ]);

    let eatenNutrition = {
      calories: 0,
      protein: 0,
      carbohydrate: 0,
      fat: 0,
    };

    let wholeNutrition = {
      calories: 0,
      protein: 0,
      carbohydrate: 0,
      fat: 0,
    };

    let response = {
      success: true,
      message: "Success fetch tracker data.",
      data: {
        date: endDate.toISOString().split("T")[0],
        nutritionGoal: null,
        eatenNutrition,
        wholeNutrition,
        mealPlan: {
          breakfast: [],
          lunch: [],
          dinner: [],
        },
        eatenFood: {
          breakfast: [],
          lunch: [],
          dinner: [],
        },
      },
    };

    meals.forEach((meal) => {
      let mealTime = meal.mealTime.toLowerCase();
      let type = meal.type.toLowerCase();

      meal.food.id = meal.id;

      wholeNutrition.calories += meal.food.calories;
      wholeNutrition.protein += meal.food.protein;
      wholeNutrition.carbohydrate += meal.food.carbohydrate;
      wholeNutrition.fat += meal.food.fat;

      if (type === "recommended") {
        response.data.mealPlan[mealTime].push(meal.food);
      } else {
        response.data.eatenFood[mealTime].push(meal.food);

        eatenNutrition.calories += meal.food.calories;
        eatenNutrition.protein += meal.food.protein;
        eatenNutrition.carbohydrate += meal.food.carbohydrate;
        eatenNutrition.fat += meal.food.fat;
      }
    });

    if (nutritionGoal) {
      eatenNutrition.calories = parseFloat(eatenNutrition.calories.toFixed(2));
      eatenNutrition.protein = parseFloat(eatenNutrition.protein.toFixed(2));
      eatenNutrition.carbohydrate = parseFloat(
        eatenNutrition.carbohydrate.toFixed(2)
      );
      eatenNutrition.fat = parseFloat(eatenNutrition.fat.toFixed(2));

      wholeNutrition.calories = parseFloat(wholeNutrition.calories.toFixed(2));
      wholeNutrition.protein = parseFloat(wholeNutrition.protein.toFixed(2));
      wholeNutrition.carbohydrate = parseFloat(
        wholeNutrition.carbohydrate.toFixed(2)
      );
      wholeNutrition.fat = parseFloat(wholeNutrition.fat.toFixed(2));

      response.data.eatenNutrition = eatenNutrition;
      response.data.wholeNutrition = wholeNutrition;
      const { calorieGoal, proteinGoal, carbohydrateGoal, fatGoal } =
        nutritionGoal;
      response.data.nutritionGoal = {
        calorieGoal,
        proteinGoal,
        carbohydrateGoal,
        fatGoal,
      };
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: { error: error.message },
      message: "Error fetching tracker data.",
    });
  }
};

export const getHistoryData = async (req, res) => {
  let endDate = moment().tz("Asia/Jakarta").endOf("day").toDate();
  let startDate = moment().tz("Asia/Jakarta").startOf("day").toDate();

  const userId = req.user.id;
  let response = {
    success: true,
    data: [],
    message: "Success fetch history.",
  };

  try {
    const page = parseInt(req.query.page) || 0;
    endDate.setDate(endDate.getDate() - page * 7);
    startDate.setDate(startDate.getDate() - page * 7);

    for (let i = 0; i < 7; i++) {
      const [nutritionGoal, meals] = await Promise.all([
        prisma.nutritionGoal.findFirst({
          where: {
            userId: userId,
            createdAt: {
              lte: endDate,
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.meal.findMany({
          where: {
            userId: userId,
            type: "EATEN",
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
          include: {
            food: true,
          },
        }),
      ]);

      let eatenNutrition = {
        calories: 0,
        protein: 0,
        carbohydrate: 0,
        fat: 0,
      };

      const foods = meals.reduce((acc, { food }) => {
        const { id, ...rest } = food;

        eatenNutrition.calories += food.calories;
        eatenNutrition.protein += food.protein;
        eatenNutrition.carbohydrate += food.carbohydrate;
        eatenNutrition.fat += food.fat;

        acc.push(rest);
        return acc;
      }, []);

      if (nutritionGoal) {
        eatenNutrition.calories = parseFloat(
          eatenNutrition.calories.toFixed(2)
        );
        eatenNutrition.protein = parseFloat(eatenNutrition.protein.toFixed(2));
        eatenNutrition.carbohydrate = parseFloat(
          eatenNutrition.carbohydrate.toFixed(2)
        );
        eatenNutrition.fat = parseFloat(eatenNutrition.fat.toFixed(2));
        const { calorieGoal, proteinGoal, carbohydrateGoal, fatGoal } =
          nutritionGoal;

        response.data.push({
          date: moment(endDate).tz("Asia/Jakarta").format("dddd, DD MMMM YYYY"),
          nutritionGoal: {
            calorieGoal,
            proteinGoal,
            carbohydrateGoal,
            fatGoal,
          },
          eatenNutrition,
          eatenFood: foods,
        });
      }
      endDate.setDate(endDate.getDate() - 1);
      startDate.setDate(startDate.getDate() - 1);
    }

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: { error: error.message },
      message: "Error fetching tracker data.",
    });
  }
};
