/*
  Warnings:

  - Added the required column `questionId` to the `QuestionData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
CREATE SEQUENCE questiondata_id_seq;
ALTER TABLE "QuestionData" ADD COLUMN     "questionId" INTEGER NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('questiondata_id_seq');
ALTER SEQUENCE questiondata_id_seq OWNED BY "QuestionData"."id";
