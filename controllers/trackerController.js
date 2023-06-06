import { check, validationResult } from "express-validator";

export const getTrackerData = [
  check("date")
    .notEmpty()
    .withMessage("Date is required.")
    .isISO8601()
    .withMessage("Invalid date format."),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        data: { errors: errors.array() },
        message: "Validation errors.",
      });
    }

    const date = new Date(req.query.date);
    date.setDate(date.getDate() + 1);
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
      const foodIntake = [];

      let response = {
        success: true,
        data: {
          nutritionGoal: null,
          foodIntake,
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
        message: "Error fetching tracker data/",
      });
    }
  },
];
