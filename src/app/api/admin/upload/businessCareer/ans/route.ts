import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import {
  parseAnsData,
  modifyGradeText,
} from "@/features/businessCareer/api/bcAns";
import {
  replaceSpacesWithUnderscore,
  extractGradeAndQualification,
  convertSingleKatakanaToNumber,
} from "@/features/businessCareer/api/bcUtils";
import { UploadBccExamSubmit } from "@/features/businessCareer/types/bcTypes";
import { revalidateTagByUpdateQuestion } from "@/lib/api";
import { createFormDataProxy } from "@/lib/proxies/createFormDataProxy";
import {
  existsData,
  getQuestions,
  updateQuestionAnswer,
} from "@/services/quizService";

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

    return NextResponse.json(examData);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "PDFの解析に失敗しました" },
      { status: 500 },
    );
  }
}
