import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import { parseProblems } from "@/features/businessCareer/api/bcExam";
import {
  replaceSpacesWithUnderscore,
  extractYear,
  extractTitle,
  extractGradeAndQualification,
} from "@/features/businessCareer/api/bcUtils";
import { UploadBccExamSubmit } from "@/features/businessCareer/types/bcTypes";
import { revalidateTagByUpdateQuestions } from "@/lib/api";
import { createFormDataProxy } from "@/lib/proxies/createFormDataProxy";
import { saveQuestions } from "@/services/quizService";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const { pdf } = createFormDataProxy<UploadBccExamSubmit>(formData);

  if (!pdf) {
    return NextResponse.json(
      { error: "ファイルがありません" },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await pdf.arrayBuffer());

  try {
    const data = await pdfParse(buffer);
    const text = data.text;

    // 年度を取得
    const year = replaceSpacesWithUnderscore(extractYear(text) || "");

    // タイトルを取得
    const title = replaceSpacesWithUnderscore(extractTitle(text) || "");
    const { grade, qualification } = extractGradeAndQualification(title) || {};

    // テキストを解析してQuestionData形式のJSONに変換
    const problems = parseProblems(text);

    if (!problems || !qualification || !grade || !year) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // 問題データをデータベースに保存
    const success = await saveQuestions(qualification, grade, year, problems);

    if (!success) {
      return NextResponse.json(
        { error: "データベースへの保存に失敗しました" },
        { status: 500 },
      );
    }

    revalidateTagByUpdateQuestions();

    return NextResponse.json({ message: "データが正常に保存されました" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "PDFの解析に失敗しました" },
      { status: 500 },
    );
  }
}
