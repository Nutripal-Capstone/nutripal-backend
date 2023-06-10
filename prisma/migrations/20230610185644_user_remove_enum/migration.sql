/*
  Warnings:

  - Added the required column `dietType` to the `User` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `gender` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `activityLevel` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `goal` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `mealsPerDay` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dietType" TEXT NOT NULL,
DROP COLUMN "gender",
ADD COLUMN     "gender" TEXT NOT NULL,
DROP COLUMN "activityLevel",
ADD COLUMN     "activityLevel" TEXT NOT NULL,
DROP COLUMN "goal",
ADD COLUMN     "goal" TEXT NOT NULL,
ALTER COLUMN "mealsPerDay" SET NOT NULL;

-- DropEnum
DROP TYPE "ActivityLevels";

-- DropEnum
DROP TYPE "Genders";

-- DropEnum
DROP TYPE "Goals";
