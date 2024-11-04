import { NextRequest, NextResponse } from "next/server";
import { ALL_CATEGORY } from "@/lib/constants";
import { getQuestions, getQuestionsByCategory } from "@/services/quizService";

type Params = Promise<{
  qualification: string;
  grade: string;
  year: string;
  category: string;
}>;

export async function GET(_: NextRequest, segmentData: { params: Params }) {
  const params = await segmentData.params;
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
