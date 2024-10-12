import { NextResponse } from "next/server";
import { ALL_CATEGORY } from "@/lib/constants";
import { getQuestions, getQuestionsByCategory } from "@/services/quizService";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: {
      qualification: string;
      grade: string;
      year: string;
      category: string;
    };
  },
) {
  const { qualification, grade, year, category } = params;
  const questions =
    category === ALL_CATEGORY
      ? await getQuestions(qualification, grade, year)
      : await getQuestionsByCategory(qualification, grade, year, category);

  if (!questions) {
    return NextResponse.json({ error: "Cuestions not found" }, { status: 404 });
  }

  return NextResponse.json(questions);
}
