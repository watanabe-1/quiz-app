"use server";

import { uploadQuizFormSchema } from "@/features/quiz/upload/json/lib/schema";
import { revalidateTagByUpdateQuestions } from "@/lib/api";
import { client } from "@/lib/client";
import { createServerAction } from "@/lib/createServerAction";
import { saveQuestions } from "@/services/quizService";
import { QuestionData } from "@/types/quizType";

export const uploadQuiz = createServerAction(
  uploadQuizFormSchema,
  client.admin.upload.$url().path,
  async (submission) => {
    const { qualification, grade, year, file } = submission.value;

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
  },
);
