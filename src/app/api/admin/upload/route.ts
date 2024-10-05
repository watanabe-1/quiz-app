import { NextResponse } from "next/server";
import { saveQuestions } from "@/services/quizService";
import { QuestionData } from "@/@types/quizType";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const qualification = formData.get("qualification") as string;
  const year = formData.get("year") as string;

  if (!file || !qualification || !year) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const content = await file.text();
  const questions = JSON.parse(content) as QuestionData[];

  // 問題データをデータベースに保存
  const success = await saveQuestions(qualification, year, questions);

  if (!success) {
    return NextResponse.json(
      { error: "データベースへの保存に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "データが正常に保存されました" });
}
