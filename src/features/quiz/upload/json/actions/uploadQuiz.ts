"use server";

import { parseWithZod } from "@conform-to/zod";
import { uploadQuizFormSchema } from "@/features/quiz/upload/json/lib/schema";
import { revalidateTagByUpdateQuestions } from "@/lib/api";
import { saveQuestions } from "@/services/quizService";
import { FormState } from "@/types/conform";
import { QuestionData } from "@/types/quizType";

export const uploadQuiz = async (
  prevState: FormState,
  data: FormData,
): Promise<FormState> => {
  const submission = parseWithZod(data, {
    schema: uploadQuizFormSchema,
  });

  if (submission.status !== "success") {
    return {
      status: "error",
      submission: submission.reply(),
    };
  }

  const value = submission.value;
  const { qualification, grade, year, file } = value;

  const content = await file.text();
  const questions = JSON.parse(content) as QuestionData[];

  // 問題データをデータベースに保存
  const success = await saveQuestions(qualification, grade, year, questions);

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
};
