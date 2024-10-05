/*
  Warnings:

  - A unique constraint covering the columns `[qualificationId,year]` on the table `Year` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Year_qualificationId_year_key" ON "Year"("qualificationId", "year");
