/*
  Warnings:

  - You are about to drop the column `qualificationId` on the `Grade` table. All the data in the column will be lost.
  - You are about to drop the column `qualificationId` on the `Year` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Grade` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[year]` on the table `Year` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_qualificationId_fkey";

-- DropForeignKey
ALTER TABLE "Year" DROP CONSTRAINT "Year_qualificationId_fkey";

-- DropIndex
DROP INDEX "Grade_qualificationId_name_key";

-- DropIndex
DROP INDEX "Year_qualificationId_year_key";

-- AlterTable
ALTER TABLE "Grade" DROP COLUMN "qualificationId";

-- AlterTable
ALTER TABLE "Year" DROP COLUMN "qualificationId";

-- CreateIndex
CREATE UNIQUE INDEX "Grade_name_key" ON "Grade"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Year_year_key" ON "Year"("year");
