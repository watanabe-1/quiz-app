"use server";

import { redirect } from "next/navigation";
import { questionDataSchema } from "@/features/quiz/edit/lib/schema";
import { revalidateTagByUpdateQuestion } from "@/lib/api";
import { client } from "@/lib/client";
import { createServerAction } from "@/lib/createServerAction";
import { existsQuestion, saveQuestion } from "@/services/quizService";

export const updateQuiz = createServerAction(
  questionDataSchema,
  // dynamic パラメータにはダミー値を設定
  client.admin._qualification("d")._grade("d")._year("d").edit._id("d").$url()
    .relativePath,
  async (submission) => {
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
      client.admin
        ._qualification(qualification)
        ._grade(grade)
        ._year(year)
        .$url().path,
    );
  },
);
