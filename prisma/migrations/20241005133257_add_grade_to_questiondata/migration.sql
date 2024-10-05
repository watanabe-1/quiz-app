/*
  Warnings:

  - A unique constraint covering the columns `[qualificationId,gradeId,yearId,questionId]` on the table `QuestionData` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gradeId` to the `QuestionData` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "QuestionData_qualificationId_yearId_questionId_key";

-- AlterTable
ALTER TABLE "QuestionData" ADD COLUMN     "gradeId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Grade" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "qualificationId" INTEGER NOT NULL,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Grade_qualificationId_name_key" ON "Grade"("qualificationId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionData_qualificationId_gradeId_yearId_questionId_key" ON "QuestionData"("qualificationId", "gradeId", "yearId", "questionId");

-- AddForeignKey
ALTER TABLE "QuestionData" ADD CONSTRAINT "QuestionData_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_qualificationId_fkey" FOREIGN KEY ("qualificationId") REFERENCES "Qualification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
