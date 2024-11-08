import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import { UploadBccExamSubmit } from "@/app/api/admin/uploadBccExam/route";
import { revalidateTagByUpdateQuestion } from "@/lib/api";
import {
  convertSingleKatakanaToNumber,
  convertToHalfWidth,
  extractGradeAndQualification,
  extractYear,
  replaceSpacesWithUnderscore,
} from "@/lib/bccuploads";
import { createFormDataProxy } from "@/lib/proxies/createFormDataProxy";
import {
  existsData,
  getQuestions,
  updateQuestionAnswer,
} from "@/services/quizService";

interface AnswerData {
  questionNumber: number;
  answer1: string;
  answer2: string;
}

interface Answer {
  questionNumber: number;
  answer: string;
}

interface CategoryAnswers {
  category: string;
  answers: Answer[];
}

interface ExamData {
  year: string;
  categories: CategoryAnswers[];
}

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
    const examData = parseExamData(text);
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

function modifyGradeText(input: string): string {
  return input.replace(/【(\d+級)([^】]+)】/, "$1_$2");
}

function extractCategories(
  text: string,
): { title: string; startIndex: number }[] {
  const categoryPattern = /【[0-9０-９]級[^】]+】/g;
  const categories = [];
  let match;

  while ((match = categoryPattern.exec(text)) !== null) {
    categories.push({
      title: match[0], // e.g., "【２級 人事・人材開発】"
      startIndex: match.index, // Start index of this category in the text
    });
  }

  return categories;
}

function extractSections(
  text: string,
): { category: string; sectionText: string }[] {
  const categories = extractCategories(text);
  const sections = [];

  for (let i = 0; i < categories.length; i++) {
    const currentCategory = categories[i];
    const nextCategory = categories[i + 1];

    const sectionText = text.substring(
      currentCategory.startIndex,
      nextCategory ? nextCategory.startIndex : text.length, // 次のカテゴリの開始位置まで
    );

    sections.push({
      category: currentCategory.title,
      sectionText,
    });
  }

  return sections;
}

function extractAnswersFromSection(sectionText: string): Answer[] {
  // Split the sectionText into lines
  const lines = sectionText.split("\n");
  const answers: AnswerData[] = [];
  let currentQuestionNumber = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // パターン1: 問題番号と解答が同じ行にある
    const matchInline = line.match(/^(\d+)\s*([ア-オ]{2})$/);
    if (matchInline) {
      currentQuestionNumber = parseInt(matchInline[1], 10);
      const answer = matchInline[2];
      answers.push({
        questionNumber: currentQuestionNumber,
        answer1: answer.charAt(0),
        answer2: answer.charAt(1),
      });
      continue;
    }

    // パターン2: 問題番号が1行、解答が次の行にある
    const matchQuestionNumber = line.match(/^(\d+)$/);
    if (matchQuestionNumber) {
      currentQuestionNumber = parseInt(matchQuestionNumber[1], 10);
      const nextLine = lines[i + 1] ? lines[i + 1].trim() : "";
      if (nextLine.match(/^[ア-オ]{2}$/)) {
        answers.push({
          questionNumber: currentQuestionNumber,
          answer1: nextLine.charAt(0),
          answer2: nextLine.charAt(1),
        });
        i++; // 次の行をスキップ
      }
    }
  }

  return adjustAnswers(answers);
}

const adjustAnswers = (answers: AnswerData[]): Answer[] => {
  const newAnswers: Answer[] = [];
  const maxQuestionNumber = Math.max(...answers.map((a) => a.questionNumber));

  answers
    .sort((a, b) => a.questionNumber - b.questionNumber)
    .forEach((item) => {
      newAnswers.push({
        questionNumber: item.questionNumber,
        answer: item.answer1,
      });
      newAnswers.push({
        questionNumber: item.questionNumber + maxQuestionNumber,
        answer: item.answer2,
      });
    });

  return newAnswers;
};

function parseExamData(text: string): ExamData {
  const year = extractYear(text) || ""; // 年度は別途正規表現で抽出可能
  const sections = extractSections(text);

  const examData: ExamData = {
    year,
    categories: sections.map((section) => ({
      category: convertToHalfWidth(section.category),
      answers: extractAnswersFromSection(cleanSectionText(section.sectionText)),
    })),
  };

  return examData;
}

function cleanSectionText(sectionText: string): string {
  // カテゴリタイトルとノイズを削除する正規表現
  return sectionText
    .replace(/【[0-9０-９]級\s+[^\s]+】/, "") // カテゴリタイトルを削除
    .replace(/（注）.*/s, "") // 「注」の部分を削除
    .replace(/(令和|平成|昭和)?[0-9０-９]*年度[^\n]*検定試験[^\n]*正解表/s, "") // 年度部分を削除
    .trim();
}
