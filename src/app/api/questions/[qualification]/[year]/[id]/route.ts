import { NextResponse } from "next/server";
import { getQuestions, saveQuestions } from "../../../../../../lib/questions";

export async function GET(
  request: Request,
  { params }: { params: { qualification: string; year: string; id: string } }
) {
  const { qualification, year, id } = params;
  const questionId = parseInt(id);
  const questions = await getQuestions(qualification, year);
  const questionData = questions.find((q) => q.id === questionId);

  if (!questionData) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  return NextResponse.json(questionData);
}

export async function PUT(
  request: Request,
  { params }: { params: { qualification: string; year: string; id: string } }
) {
  const { qualification, year, id } = params;
  const questionId = parseInt(id);
  const updatedQuestion = await request.json();

  const questions = await getQuestions(qualification, year);
  const index = questions.findIndex((q) => q.id === questionId);

  if (index === -1) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  questions[index] = updatedQuestion;

  const success = await saveQuestions(qualification, year, questions);

  if (!success) {
    return NextResponse.json(
      { error: "Failed to update question" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Question updated successfully" });
}
