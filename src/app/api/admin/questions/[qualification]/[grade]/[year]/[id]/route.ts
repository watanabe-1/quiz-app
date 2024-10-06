import { NextResponse } from "next/server";
import { getQuestions, saveQuestions } from "@/services/quizService";
import { revalidateTagByUpdateQuestion } from "@/lib/api";

export async function PUT(
  request: Request,
  {
    params,
  }: {
    params: { qualification: string; grade: string; year: string; id: string };
  }
) {
  const { qualification, grade, year, id } = params;
  const questionId = parseInt(id);
  const updatedQuestion = await request.json();

  const questions = await getQuestions(qualification, grade, year);
  const index = questions.findIndex((q) => q.questionId === questionId);

  if (index === -1) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  questions[index] = updatedQuestion;

  const success = await saveQuestions(qualification, grade, year, questions);

  if (!success) {
    return NextResponse.json(
      { error: "Failed to update question" },
      { status: 500 }
    );
  }

  revalidateTagByUpdateQuestion();

  return NextResponse.json({ message: "Question updated successfully" });
}
