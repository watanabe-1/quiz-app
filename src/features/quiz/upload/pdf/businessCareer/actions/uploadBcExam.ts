"use server";

import { parseWithZod } from "@conform-to/zod";
import pdfParse from "pdf-parse";
import { parseProblems } from "@/features/quiz/upload/pdf/businessCareer/lib/bcExam";
import {
  replaceSpacesWithUnderscore,
  extractYear,
  extractTitle,
  extractGradeAndQualification,
} from "@/features/quiz/upload/pdf/businessCareer/lib/bcUtils";
import { uploadBcSchema } from "@/features/quiz/upload/pdf/businessCareer/lib/uploadBcSchema";
import { revalidateTagByUpdateQuestions } from "@/lib/api";
import { saveQuestions } from "@/services/quizService";
import { FormState } from "@/types/conform";

export const uploadBcExam = async (
  prevState: FormState,
  data: FormData,
): Promise<FormState> => {
  const submission = parseWithZod(data, {
    schema: uploadBcSchema,
  });

  if (submission.status !== "success") {
    return {
      status: "error",
      submission: submission.reply(),
    };
  }

  const value = submission.value;
  const { file } = value;

  const buffer = Buffer.from(await file.arrayBuffer());

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
      return {
        status: "error",
        submission: submission.reply({
          formErrors: ["PDFの解析に失敗しました"],
        }),
      };
    }

    // 問題データをデータベースに保存
    const success = await saveQuestions(qualification, grade, year, problems);

    if (!success) {
      return {
        status: "error",
        submission: submission.reply({
          formErrors: ["データベースへの保存に失敗しました"],
        }),
      };
    }

    revalidateTagByUpdateQuestions();

    return {
      status: "success",
      message: "データベースへの保存に成功しました",
      submission: submission.reply(),
    };
  } catch (_) {
    return {
      status: "error",
      submission: submission.reply({
        formErrors: ["PDFの解析に失敗しました"],
      }),
    };
  }
};