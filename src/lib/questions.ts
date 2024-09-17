import { QuestionData } from "@/@types/quizType";
import fs from "fs/promises";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "questions.json");

export async function getAllQuestions() {
  const jsonData = await fs.readFile(dataFilePath, "utf8");
  return JSON.parse(jsonData) as QuestionData[];
}

export async function getQuestionById(id: number) {
  const questions = await getAllQuestions();
  return questions.find((question: QuestionData) => question.id === id);
}

export async function saveQuestions(questions: QuestionData) {
  try {
    const data = JSON.stringify(questions, null, 2);
    await fs.writeFile(dataFilePath, data, "utf8");
    return true;
  } catch (error) {
    console.error("Error saving questions:", error);
    return false;
  }
}
