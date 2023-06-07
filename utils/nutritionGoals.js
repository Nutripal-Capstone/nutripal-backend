// Need more research

const Genders = {
  M: 'M',
  F: 'F'
};

const ActivityLevels = {
  SD: 1.2,
  LA: 1.375,
  MA: 1.55,
  VA: 1.725,
  SA: 1.9
};

const Goals = {
  LW: 0.85,
  MW: 1,
  GW: 1.15
};

export const calculateNutrition = (age, height, weight, gender, activityLevel, goal) => {
  let bmr;

  if (gender === Genders.M) {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  let tdee = bmr * ActivityLevels[activityLevel];
  let calorieGoal = Math.round(tdee * Goals[goal]);

  let proteinGoal = Math.round((calorieGoal * 0.225) / 4);
  let fatGoal = Math.round((calorieGoal * 0.275) / 9);
  let carbohydrateGoal = Math.round((calorieGoal * 0.55) / 4); 

  return {
    calorieGoal,
    proteinGoal,
    fatGoal,
    carbohydrateGoal,
  };
};
