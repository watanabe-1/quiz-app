"use server";

import { parseWithZod } from "@conform-to/zod";
import pdfParse from "pdf-parse";
import {
  parseAnsData,
  modifyGradeText,
} from "@/features/quiz/upload/pdf/businessCareer/lib/bcAns";
import {
  replaceSpacesWithUnderscore,
  extractGradeAndQualification,
  convertSingleKatakanaToNumber,
} from "@/features/quiz/upload/pdf/businessCareer/lib/bcUtils";
import { uploadBcSchema } from "@/features/quiz/upload/pdf/businessCareer/lib/uploadBcSchema";
import { revalidateTagByUpdateQuestion } from "@/lib/api";
import {
  existsData,
  getQuestions,
  updateQuestionAnswer,
} from "@/services/quizService";
import { FormState } from "@/types/conform";

export const uploadBcAns = async (
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

    // Parse the extracted text
    const examData = parseAnsData(text);
    const year = replaceSpacesWithUnderscore(examData.year);

    for (const category of examData.categories) {
      const title = modifyGradeText(category.category);
      const { grade, qualification } =
        extractGradeAndQualification(title) || {};

      if (!grade || !qualification) {
        continue;
      }

      // データが存在するかチェック
      const dataExists = await existsData(qualification, grade, year);

      if (dataExists) {
        // 質問データを取得
        const questions = await getQuestions(qualification, grade, year);

        // 質問データの更新
        for (const question of questions) {
          const answer = category.answers.find(
            (ans) => ans.questionNumber === question.questionId,
          );
          if (answer) {
            const convertedAnswer =
              convertSingleKatakanaToNumber(answer.answer) || question.answer;

            // 質問の解答をデータベースに更新
            await updateQuestionAnswer(
              qualification,
              grade,
              year,
              question.questionId,
              convertedAnswer,
            );
          }
        }
      }
    }

    revalidateTagByUpdateQuestion();

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
