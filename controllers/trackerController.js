import moment from "moment-timezone";

export const getTrackerData = async (req, res) => {
  let startDate = moment().tz("Asia/Jakarta").startOf("day").toDate();
  let endDate = moment().tz("Asia/Jakarta").endOf("day").toDate();

  const userId = req.user.id;
  try {
    const nutritionGoal = await prisma.nutritionGoal.findFirst({
      where: {
        userId: userId,
        createdAt: {
          lte: endDate,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const meals = await prisma.meal.findMany({
      where: {
        userId: userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        food: true,
      },
    });

    let response = {
      success: true,
      message: "Success fetch tracker data.",
      data: {
        date: endDate.toISOString().split("T")[0],
        nutritionGoal: null,
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
      if (type === "recommended") {
        response.data.mealPlan[mealTime].push(meal.food);
      } else {
        response.data.eatenFood[mealTime].push(meal.food);
      }
    });

    if (nutritionGoal) {
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
          eatenFood: foods,
          eatenNutrition,
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
