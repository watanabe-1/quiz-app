import { katakanaToNumbersMap } from "@/lib/constants";
import { QuestionData, QuestionOption } from "@/types/quizType";

/**
 * Parses the provided text and returns an array of question data.
 * @param text - The entire text containing the questions.
 * @returns An array of parsed question data. Returns an empty array if no questions are found.
 */
export function parseProblems(text: string): QuestionData[] {
  const problems: QuestionData[] = [];

  // Remove footers and unnecessary information from the text
  const preprocessedText = cleanText(text);

  // Find the position of the first occurrence of "問題1" (Question 1)
  const regexForStartIndex = /問題[1１][\s]/;
  const startIndex = preprocessedText.search(regexForStartIndex);
  if (startIndex === -1) {
    // Return an empty array if "問題1" is not found
    return problems;
  }
  // Target the text from "問題1" onward
  const targetText = preprocessedText.slice(startIndex);

  // Append a dummy question number at the end to capture the last question
  const targetText2 = targetText + " \n問題41";

  // Adjust the regular expression pattern to support full-width numbers
  const problemRegex =
    /^問題\s*([0-9０-９]+)\s*((?:.|\n)*?)(?=^(?:問題\s*[0-9０-９]+|Z))/gm;
  let match;

  while ((match = problemRegex.exec(targetText2)) !== null && match[0] !== "") {
    // Convert full-width numbers to half-width
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

/**
 * Removes footers and unnecessary information from the given text.
 * @param text - The text containing footers and unnecessary information.
 * @returns The text with footers and unnecessary information removed.
 */
export function cleanText(text: string): string {
  // Patterns for removing footers and unnecessary information
  const unwantedPatterns = [
    /[HR]\d{1,2}[前後]-\d{3}[A-Z]\d{2}-\d{1,2}/g, // Footer pattern
    /禁転載複製/g, // "No reproduction or duplication"
    /「中央職業能力開発協会編」/g, // "Compiled by Central Vocational Ability Development Association"
  ];
  let cleanedText = text;
  for (const pattern of unwantedPatterns) {
    cleanedText = cleanedText.replace(pattern, "");
  }
  return cleanedText;
}

/**
 * Parses the content of the question and extracts the question text and options.
 * @param content - The text of the question.
 * @returns The question text and an array of options.
 */
export function extractQuestionAndOptions(content: string): {
  questionText: string;
  options: QuestionOption[];
} {
  const optionLabels = Array.from(katakanaToNumbersMap.keys());
  const optionSeparator = "[．.]"; // Matches both full-width and half-width periods
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
    const trimmedPart = part.replace(/^[\s\u3000.．]+|[\s\u3000.．]+$/g, "");
    if (optionLabels.some((label) => trimmedPart === label)) {
      if (isOption && currentOptionText) {
        // Remove unnecessary text
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

  // Add the last option
  if (isOption && currentOptionText) {
    const cleanedOptionText = cleanText(currentOptionText.trim());
    if (cleanedOptionText) {
      options.push({
        text: cleanedOptionText,
      });
    }
  }

  // Clean up the question text
  questionText = cleanText(questionText.trim());

  return {
    questionText: questionText,
    options,
  };
}
