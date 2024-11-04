import { NextResponse } from "next/server";
import { fetchGetQuestionsByCategory } from "@/lib/api";

type Params = Promise<{
  qualification: string;
  grade: string;
  year: string;
  category: string;
  id: string;
}>;

export async function GET(request: Request, segmentData: { params: Params }) {
  const params = await segmentData.params;
  const { qualification, grade, year, category, id } = params;
  const questionId = parseInt(id);
  // できるだけキャッシュから取得したいので、questionId単位でのSQL発行は行わない
  const questions = await fetchGetQuestionsByCategory(
    qualification,
    grade,
    year,
    category,
  );
  const questionData = questions.find((q) => q.questionId === questionId);

  if (!questionData) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  return NextResponse.json(questionData);
}
