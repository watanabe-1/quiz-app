import { QuestionData } from "@/@types/quizType";
import fs from "fs/promises";
import path from "path";

// 資格一覧を取得
export async function getAllQualifications(): Promise<string[]> {
  const dataDir = path.join(process.cwd(), "data");
  const qualifications = await fs.readdir(dataDir);
  return qualifications;
}

// 指定した資格の年度一覧を取得
export async function getYearsByQualification(
  qualification: string
): Promise<string[]> {
  const qualificationDir = path.join(process.cwd(), "data", qualification);
  const files = await fs.readdir(qualificationDir);
  const years = files
    .filter((file) => file.endsWith(".json"))
    .map((file) => path.parse(file).name);
  return years;
}

// 指定した資格と年度の問題を取得
export async function getQuestions(
  qualification: string,
  year: string
): Promise<QuestionData[]> {
  const dataFilePath = path.join(
    process.cwd(),
    "data",
    qualification,
    `${year}.json`
  );
  const jsonData = await fs.readFile(dataFilePath, "utf8");
  return JSON.parse(jsonData);
}

// 指定した資格と年度のカテゴリ一覧を取得
export async function getCategories(
  qualification: string,
  year: string
): Promise<string[]> {
  const questions = await getQuestions(qualification, year);
  const categories = Array.from(new Set(questions.map((q) => q.category)));
  return categories;
}

// 指定した資格、年度、カテゴリの問題を取得
export async function getQuestionsByCategory(
  qualification: string,
  year: string,
  category: string
): Promise<QuestionData[]> {
  const questions = await getQuestions(qualification, year);
  return questions.filter((q) => q.category === category);
}

// 指定した資格、年度、IDの問題を取得
export async function getQuestionById(
  qualification: string,
  year: string,
  id: number
): Promise<QuestionData | undefined> {
  const questions = await getQuestions(qualification, year);
  return questions.find((q) => q.id === id);
}

// 問題データを保存（資格、年度ごと）
export async function saveQuestions(
  qualification: string,
  year: string,
  questions: QuestionData[]
): Promise<boolean> {
  try {
    const dataFilePath = path.join(
      process.cwd(),
      "data",
      qualification,
      `${year}.json`
    );
    const data = JSON.stringify(questions, null, 2);
    await fs.writeFile(dataFilePath, data, "utf8");
    return true;
  } catch (error) {
    console.error("Error saving questions:", error);
    return false;
  }
}

// 指定した資格と年度のファイルが存在するかチェックする
export async function existsFile(
  qualification: string,
  year: string
): Promise<boolean> {
  const dataFilePath = path.join(
    process.cwd(),
    "data",
    qualification,
    `${year}.json`
  );
  try {
    await fs.access(dataFilePath);
    return true;
  } catch (error) {
    return false;
  }
}
