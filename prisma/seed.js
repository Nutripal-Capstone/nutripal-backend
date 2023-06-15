import { fileURLToPath } from "url";
import { dirname } from "path";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const moduleDir = dirname(fileURLToPath(import.meta.url));
  const jsonFilePath = path.join(moduleDir, "food.json");

  const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, "utf-8"));

  for (const data of jsonData) {
    await prisma.food.create({
      data: {
        foodId: data.food_id,
        servingId: data.serving_id,
        foodName: data.food_name,
        servingDescription: data.serving_description,
        calories: data.calories,
        protein: data.protein,
        carbohydrate: data.carbohydrate,
        fat: data.fat,
      },
    });
  }
}

main()
  .catch((error) => {
    console.error("Error seeding database:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
