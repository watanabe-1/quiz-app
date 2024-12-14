"use server";

import { redirect } from "next/navigation";
import { permission } from "@/features/permission/lib/permission";
import { questionDataSchema } from "@/features/quiz/edit/lib/schema";
import { revalidateTagByUpdateQuestion } from "@/lib/api";
import { createServerAction } from "@/lib/createServerAction";
import {
  path_admin_Dqualification_Dgrade_Dyear,
  path_admin_Dqualification_Dgrade_Dyear_edit_Did,
} from "@/lib/path";
import { existsQuestion, saveQuestion } from "@/services/quizService";

export const updateQuiz = createServerAction(
  questionDataSchema,
  async (submission) => {
    if (submission.status !== "success") {
      return {
        status: "error",
        submission: submission.reply(),
      };
    }

    const value = submission.value;
    const { qualification, grade, year, questionId } = value;

    if (!existsQuestion(qualification, grade, year, questionId)) {
      return {
        status: "error",
        submission: submission.reply({
          formErrors: ["Question not found"],
        }),
      };
    }

    const success = await saveQuestion(qualification, grade, year, value);

    if (!success) {
      return {
        status: "error",
        submission: submission.reply({
          formErrors: ["Failed to update question"],
        }),
      };
    }

    revalidateTagByUpdateQuestion();

    redirect(
      path_admin_Dqualification_Dgrade_Dyear(qualification, grade, year).$url()
        .path,
    );
  },
  [
    async () =>
      permission.page.access(
        // dynamic パラメータにはダミー値を設定
        path_admin_Dqualification_Dgrade_Dyear_edit_Did(
          "d",
          "d",
          "d",
          "d",
        ).$url().path,
      ),
  ],
);
