import { NextResponse } from "next/server";
import { revalidateTagByUpdateQuestion } from "@/lib/api";
import { existsQuestion, saveQuestion } from "@/services/quizService";

type Params = Promise<{
  qualification: string;
  grade: string;
  year: string;
  id: string;
}>;

export async function PUT(request: Request, segmentData: { params: Params }) {
  const params = await segmentData.params;
  const { qualification, grade, year, id } = params;
  const questionId = parseInt(id);
  const updatedQuestion = await request.json();

  if (!existsQuestion(qualification, grade, year, questionId)) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  const success = await saveQuestion(
    qualification,
    grade,
    year,
    updatedQuestion,
  );

  if (!success) {
    return NextResponse.json(
      { error: "Failed to update question" },
      { status: 500 },
    );
  }

  revalidateTagByUpdateQuestion();

  return NextResponse.json({ message: "Question updated successfully" });
}
