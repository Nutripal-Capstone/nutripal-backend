// Need more research

const ActivityLevels = {
  "Sedentary": 1.2,
  "Lightly Active": 1.375,
  "Maintain Active": 1.55,
  "Very Active": 1.725,
  "Super Active": 1.9,
};

const Goals = {
  "Lose Weight": 0.85,
  "Maintain Weight": 1,
  "Gain Weight": 1.15,
};

const Diets = {
  "Standard Balanced Diet": { carbs: 0.5, protein: 0.225, fat: 0.275 }, 
  "High Carb Diet": { carbs: 0.6, protein: 0.15, fat: 0.25 }, 
  "Keto Diet": { carbs: 0.05, protein: 0.2, fat: 0.75 }, 
  "High Protein Diet": { carbs: 0.3, protein: 0.4, fat: 0.3 }, 
  "Low Fat Diet": { carbs: 0.6, protein: 0.2, fat: 0.2 }, 
};


export const calculateNutrition = (
  age,
  height,
  weight,
  gender,
  activityLevel,
  goal,
  dietType
) => {
  let bmr;

  if (gender === "Male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  let tdee = bmr * ActivityLevels[activityLevel];
  let calorieGoal = Math.round(tdee * Goals[goal]);

  const diet = Diets[dietType]; 

  let proteinGoal = Math.round((calorieGoal * diet.protein) / 4);
  let fatGoal = Math.round((calorieGoal * diet.fat) / 9);
  let carbohydrateGoal = Math.round((calorieGoal * diet.carbs) / 4);

  return {
    calorieGoal,
    proteinGoal,
    fatGoal,
    carbohydrateGoal,
  };
};
