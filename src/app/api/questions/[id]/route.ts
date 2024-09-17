import { NextResponse } from "next/server";
import { getQuestionById, saveQuestions } from "../../../../lib/questions";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const questionId = parseInt(params.id);
  const questionData = await getQuestionById(questionId);

  if (!questionData) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  return NextResponse.json(questionData);
}

export async function PUT(
  request: Request
  //   { params }: { params: { id: string } }
) {
  const updatedQuestion = await request.json();
  const success = await saveQuestions(updatedQuestion);
  //   const questionId = parseInt(params.id);

  if (!success) {
    return NextResponse.json(
      { error: "Failed to update question" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Question updated successfully" });
}
