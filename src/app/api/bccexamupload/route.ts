import { QuestionData, QuestionOption } from "@/@types/quizType";
import { NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: Request) {
  const data = await request.formData();
  const file = data.get("pdf") as File;

  if (!file) {
    return NextResponse.json(
      { error: "ファイルがありません" },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const data = await pdfParse(buffer);
    const text = data.text;

    // 年度を取得
    const year = extractYear(text);

    // タイトルを取得
    const qualification = extractTitle(text);

    // テキストを解析してQuestionData形式のJSONに変換
    const problems = parseProblems(text);

    if (!problems || !qualification || !year) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const dirPath = path.join(process.cwd(), "data", qualification);
    await fs.mkdir(dirPath, { recursive: true });

    const filePath = path.join(dirPath, `${year}.json`);
    await fs.writeFile(filePath, JSON.stringify(problems, null, 2), "utf8");

    return NextResponse.json({ problems });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "PDFの解析に失敗しました" },
      { status: 500 }
    );
  }
}

function extractYear(text: string) {
  const yearPattern = /((令和|平成|昭和)?[0-9０-９]+年度\s?[前後]期)/;
  const yearMatch = text.match(yearPattern);
  return yearMatch ? convertToHalfWidth(yearMatch[0]) : null;
}

function extractTitle(text: string) {
  const titlePattern = /([0-9０-９]+級\s?[^\s]+)/;
  const titleMatch = text.match(titlePattern);
  return titleMatch ? convertToHalfWidth(titleMatch[0]) : null;
}

function convertToHalfWidth(str: string) {
  return str.replace(/[０-９]/g, function (char) {
    return String.fromCharCode(char.charCodeAt(0) - 0xfee0);
  });
}

function parseProblems(text: string): QuestionData[] {
  const problems: QuestionData[] = [];

  // テキストからフッターや不要な情報を除去
  const preprocessedText = preprocessText(text);

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
      String.fromCharCode(s.charCodeAt(0) - 0xfee0)
    );
    const id = parseInt(idStr, 10);
    const content = match[2].trim();

    const { questionText, options } = extractQuestionAndOptions(content);

    const problem: QuestionData = {
      id,
      category: "なし",
      question: { text: questionText },
      options,
      answer: 0,
    };

    problems.push(problem);
  }

  return problems;
}

function preprocessText(text: string): string {
  // フッターや不要な情報を除去するパターン
  const unwantedPatterns = [
    /H\d+前-061B01-\d+/g, // フッターのパターン
    /禁転載複製/g, // 禁転載複製
    /「中央職業能力開発協会編」/g, // 中央職業能力開発協会編
  ];
  let cleanedText = text;
  for (const pattern of unwantedPatterns) {
    cleanedText = cleanedText.replace(pattern, "");
  }
  return cleanedText;
}

function cleanText(text: string): string {
  // フッターや不要な情報を除去
  const unwantedPatterns = [
    /H\d+前-061B01-\d+/g,
    /禁転載複製/g,
    /「中央職業能力開発協会編」/g,
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
  const optionLabels = ["ア", "イ", "ウ", "エ", "オ"];
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
    const trimmedPart = part.replace(/^[\s　]+|[\s　]+$/g, "");
    if (optionLabels.some((label) => trimmedPart.startsWith(label))) {
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
