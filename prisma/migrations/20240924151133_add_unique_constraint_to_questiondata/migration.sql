/*
  Warnings:

  - A unique constraint covering the columns `[qualificationId,yearId,questionId]` on the table `QuestionData` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "QuestionData_qualificationId_yearId_questionId_key" ON "QuestionData"("qualificationId", "yearId", "questionId");
