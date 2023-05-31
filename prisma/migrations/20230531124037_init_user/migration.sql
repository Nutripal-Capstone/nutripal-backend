-- CreateEnum
CREATE TYPE "Genders" AS ENUM ('M', 'F');

-- CreateEnum
CREATE TYPE "ActivityLevels" AS ENUM ('SD', 'LA', 'MA', 'VA', 'SA');

-- CreateEnum
CREATE TYPE "Goals" AS ENUM ('LW', 'MW', 'GW');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firebaseId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "height" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "gender" "Genders" NOT NULL,
    "age" INTEGER NOT NULL,
    "activityLevel" "ActivityLevels" NOT NULL,
    "goal" "Goals" NOT NULL,
    "email" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_firebaseId_key" ON "User"("firebaseId");
