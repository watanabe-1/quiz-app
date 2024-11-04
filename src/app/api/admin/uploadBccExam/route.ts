import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import { QuestionData, QuestionOption } from "@/@types/quizType";
import { UploadBccExamSubmit } from "@/app/admin/uploadBccExam/page";
import { revalidateTagByUpdateQuestions } from "@/lib/api";
import {
  extractYear,
  extractTitle,
  replaceSpacesWithUnderscore,
  extractGradeAndQualification,
} from "@/lib/bccuploads";
import { katakanaToNumbersMap } from "@/lib/constants";
import { createFormDataProxy } from "@/lib/proxies/createFormDataProxy";
import { saveQuestions } from "@/services/quizService";

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

    // 年度を取得
    const year = replaceSpacesWithUnderscore(extractYear(text) || "");

    // タイトルを取得
    const title = replaceSpacesWithUnderscore(extractTitle(text) || "");
    const { grade, qualification } = extractGradeAndQualification(title) || {};

    // テキストを解析してQuestionData形式のJSONに変換
    const problems = parseProblems(text);

    if (!problems || !qualification || !grade || !year) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // 問題データをデータベースに保存
    const success = await saveQuestions(qualification, grade, year, problems);

    if (!success) {
      return NextResponse.json(
        { error: "データベースへの保存に失敗しました" },
        { status: 500 },
      );
    }

    revalidateTagByUpdateQuestions();

    return NextResponse.json({ message: "データが正常に保存されました" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "PDFの解析に失敗しました" },
      { status: 500 },
    );
  }
}

function parseProblems(text: string): QuestionData[] {
  const problems: QuestionData[] = [];

  // テキストからフッターや不要な情報を除去
  const preprocessedText = cleanText(text);

  // テキスト内で最初に「問題1」が出現する位置を特定
  const regexForStartIndex = /問題[1１][\s]/;
  const startIndex = preprocessedText.search(regexForStartIndex);
  if (startIndex === -1) {
    // 「問題1」が見つからない場合は空の配列を返す
    return problems;
  }
  // 「問題1」以降のテキストを対象とする
  const targetText = preprocessedText.slice(startIndex);

  // 最後の問題も取得できるように架空の問題番号を最後に付与
  const targetText2 = targetText + " \n問題41";

  // 正規表現パターンを修正（全角数字に対応）
  const problemRegex =
    /^問題\s*([0-9０-９]+)\s*((?:.|\n)*?)(?=^(?:問題\s*[0-9０-９]+|\Z))/gm;
  let match;

  while ((match = problemRegex.exec(targetText2)) !== null && match[0] != "") {
    // 全角数字を半角数字に変換
    const idStr = match[1].replace(/[０-９]/g, (s) =>
      String.fromCharCode(s.charCodeAt(0) - 0xfee0),
    );
    const id = parseInt(idStr, 10);
    const content = match[2].trim();

    const { questionText, options } = extractQuestionAndOptions(content);

    const problem: QuestionData = {
      questionId: id,
      category: "なし",
      question: { text: questionText },
      options,
      answer: 0,
    };

    problems.push(problem);
  }

  return problems;
}

function cleanText(text: string): string {
  // フッターや不要な情報を除去するパターン
  const unwantedPatterns = [
    /[HR]\d{1,2}[前後]-\d{3}[A-Z]\d{2}-\d{1,2}/g, // フッターのパターン
    /禁転載複製/g, // 禁転載複製
    /「中央職業能力開発協会編」/g, // 中央職業能力開発協会編
  ];
  let cleanedText = text;
  for (const pattern of unwantedPatterns) {
    cleanedText = cleanedText.replace(pattern, "");
  }
  return cleanedText;
}

function extractQuestionAndOptions(content: string): {
  questionText: string;
  options: QuestionOption[];
} {
  const optionLabels = Array.from(katakanaToNumbersMap.keys());
  const optionSeparator = "[．\\.]"; // 全角・半角のピリオドにマッチ
  const optionRegexString = optionLabels
    .map((label) => `${label}${optionSeparator}\\s*`)
    .join("|");
  const optionRegex = new RegExp(`(${optionRegexString})`, "g");

  const parts = content.split(optionRegex).filter((part) => part.trim() !== "");

  let questionText = "";
  const options: QuestionOption[] = [];

  let isOption = false;
  let currentOptionText = "";

  for (const part of parts) {
    const trimmedPart = part.replace(/^[\s　\.．]+|[\s　\.．]+$/g, "");
    if (optionLabels.some((label) => trimmedPart === label)) {
      if (isOption && currentOptionText) {
        // 不要なテキストを除去
        const cleanedOptionText = cleanText(currentOptionText.trim());
        if (cleanedOptionText) {
          options.push({
            text: cleanedOptionText,
          });
        }
      }
      isOption = true;
      currentOptionText = "";
    } else {
      if (isOption) {
        currentOptionText += part + " ";
      } else {
        questionText += part + " ";
      }
    }
  }

  // 最後の選択肢を追加
  if (isOption && currentOptionText) {
    const cleanedOptionText = cleanText(currentOptionText.trim());
    if (cleanedOptionText) {
      options.push({
        text: cleanedOptionText,
      });
    }
  }

  // 質問文もクリーンアップ
  questionText = cleanText(questionText.trim());

  return {
    questionText: questionText,
    options,
  };
}
