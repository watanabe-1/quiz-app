"use server";

import { permission } from "@/features/permission/lib/permission";
import { uploadQuizFormSchema } from "@/features/quiz/upload/json/lib/schema";
import { revalidateTagByUpdateQuestions } from "@/lib/api";
import { createServerAction } from "@/lib/createServerAction";
import { path_admin_upload } from "@/lib/path";
import { saveQuestions } from "@/services/quizService";
import { QuestionData } from "@/types/quizType";

export const uploadQuiz = createServerAction(
  uploadQuizFormSchema,
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
  [async () => permission.page.access(path_admin_upload().$url().path)],
);
