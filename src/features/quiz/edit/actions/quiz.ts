"use server";

import { type SubmissionResult } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { questionDataSchema } from "@/features/quiz/edit/lib/schema";
import { revalidateTagByUpdateQuestion } from "@/lib/api";
import { existsQuestion, saveQuestion } from "@/services/quizService";

type FormState =
  | {
      status: "success";
      message: string;
      submission?: SubmissionResult;
    }
  | {
      status: "error";
      submission?: SubmissionResult;
    }
  | {
      status: "idle";
      submission?: SubmissionResult;
    };

export const updateQuiz = async (
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

  return {
    status: "success",
    message: "更新に成功しました",
    submission: submission.reply(),
  };
};
