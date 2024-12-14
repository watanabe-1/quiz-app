"use server";

import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { questionDataSchema } from "@/features/quiz/edit/lib/schema";
import { revalidateTagByUpdateQuestion } from "@/lib/api";
import { path_admin_Dqualification_Dgrade_Dyear } from "@/lib/path";
import { existsQuestion, saveQuestion } from "@/services/quizService";
import { FormState, ServerActionHandler } from "@/types/conform";

export const updateQuiz: ServerActionHandler = async (
  prevState: FormState,
  data: FormData,
): Promise<FormState> => {
  const submission = parseWithZod(data, {
    schema: questionDataSchema,
  });

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

  // ここに到達しない想定だが一応記載
  return {
    status: "success",
    message: "更新に成功しました",
    submission: submission.reply(),
  };
};
