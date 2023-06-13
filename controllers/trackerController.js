import moment from "moment-timezone";

export const getTrackerData = async (req, res) => {
  let date = moment().tz("Asia/Jakarta").endOf("day").toDate();

  const userId = req.user.id;
  try {
    const nutritionGoal = await prisma.nutritionGoal.findFirst({
      where: {
        userId: userId,
        createdAt: {
          lte: date,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    //TODO: fetch food intake
    const eatenFood = [];
    const foodRecommendation = [];

    let response = {
      success: true,
      data: {
        nutritionGoal: null,
        foodRecommendation,
        eatenFood,
      },
      message: "Success fetch tracker data.",
    };

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
  let date = moment().tz("Asia/Jakarta").endOf("day").toDate();

  const userId = req.user.id;
  let response = {
    success: true,
    data: [],
    message: "Success fetch history.",
  };

  try {
    const page = parseInt(req.query.page) || 0;
    date.setDate(date.getDate() - page * 7);

    for (let i = 0; i < 7; i++) {
      const nutritionGoal = await prisma.nutritionGoal.findFirst({
        where: {
          userId: userId,
          createdAt: {
            lte: date,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (nutritionGoal) {
        const { calorieGoal, proteinGoal, carbohydrateGoal, fatGoal } =
          nutritionGoal;

        response.data.push({
          date: date.toISOString().split("T")[0],
          nutritionGoal: {
            calorieGoal,
            proteinGoal,
            carbohydrateGoal,
            fatGoal,
          },
          eatenFood: [],
        });
      }

      // Move to the previous day.
      date.setDate(date.getDate() - 1);
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
