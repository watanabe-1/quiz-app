import { NextRequest, NextResponse } from "next/server";
import { QuestionData } from "@/@types/quizType";
import { UploadSubmit } from "@/app/admin/upload/page";
import { createFormDataProxy } from "@/lib/proxies/createFormDataProxy";
import { saveQuestions } from "@/services/quizService";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const { file, qualification, grade, year } =
    createFormDataProxy<UploadSubmit>(formData);

  if (!file || !qualification || !year) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const content = await file.text();
  const questions = JSON.parse(content) as QuestionData[];

  // 問題データをデータベースに保存
  const success = await saveQuestions(qualification, grade, year, questions);

  if (!success) {
    return NextResponse.json(
      { error: "データベースへの保存に失敗しました" },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: "データが正常に保存されました" });
}
