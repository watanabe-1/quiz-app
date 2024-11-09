import {
  extractYear,
  convertToHalfWidth,
} from "@/features/businessCareer/api/bcUtils";
import {
  Answer,
  AnswerData,
  ExamData,
} from "@/features/businessCareer/types/bcTypes";

/**
 * Modifies the grade text by inserting an underscore between the grade level and text.
 * @param input - Input string (e.g., "【2級 人事・人材開発】").
 * @returns The modified string (e.g., "2級_人事・人材開発").
 */
export function modifyGradeText(input: string): string {
  return input.replace(/【(\d+級)([^】]+)】/, "$1_$2");
}

/**
 * Extracts categories from the given text.
 * @param text - The full text containing categories.
 * @returns An array of objects containing each category's title and its starting index.
 */
export function extractCategories(
  text: string,
): { title: string; startIndex: number }[] {
  const categoryPattern = /【[0-9０-９]級[^】]+】/g;
  const categories = [];
  let match;

  while ((match = categoryPattern.exec(text)) !== null) {
    categories.push({
      title: match[0], // Example: "【2級 人事・人材開発】"
      startIndex: match.index, // Start index of this category in the text
    });
  }

  return categories;
}

/**
 * Extracts sections from the text, splitting it by categories.
 * @param text - The full text containing multiple sections.
 * @returns An array of objects containing category titles and their corresponding section text.
 */
export function extractSections(
  text: string,
): { category: string; sectionText: string }[] {
  const categories = extractCategories(text);
  const sections = [];

  for (let i = 0; i < categories.length; i++) {
    const currentCategory = categories[i];
    const nextCategory = categories[i + 1];

    const sectionText = text.substring(
      currentCategory.startIndex,
      nextCategory ? nextCategory.startIndex : text.length,
    );

    sections.push({
      category: currentCategory.title,
      sectionText,
    });
  }

  return sections;
}

/**
 * Extracts answers from a given section of text.
 * @param sectionText - The text of a single section.
 * @returns An array of extracted answers.
 */
export function extractAnswersFromSection(sectionText: string): Answer[] {
  const lines = sectionText.split("\n");
  const answers: AnswerData[] = [];
  let currentQuestionNumber = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Pattern 1: The question number and answer are on the same line
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

    // Pattern 2: The question number is on one line, and the answer is on the next line
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
        i++; // Skip the next line
      }
    }
  }

  return adjustAnswers(answers);
}

/**
 * Adjusts the answers by splitting each answer into separate questions.
 * @param answers - An array of extracted answer data.
 * @returns An array of adjusted answers with split question numbers.
 */
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

/**
 * Parses the given text to extract exam data, including the year, categories, and answers.
 * @param text - The full text containing exam data.
 * @returns An object containing the parsed exam data.
 */
export function parseAnsData(text: string): ExamData {
  const year = extractYear(text) || "";
  const sections = extractSections(text);
  console.log(
    "🚀 ~ parseAnsData ~ sections:",
    cleanSectionText(sections[0].sectionText),
  );

  const examData: ExamData = {
    year,
    categories: sections.map((section) => ({
      category: convertToHalfWidth(section.category),
      answers: extractAnswersFromSection(cleanSectionText(section.sectionText)),
    })),
  };

  return examData;
}

/**
 * Cleans a section of text by removing unnecessary noise such as category titles and notes.
 * @param sectionText - The text of a section.
 * @returns The cleaned section text.
 */
export function cleanSectionText(sectionText: string): string {
  return sectionText
    .replace(/【[0-9０-９]級\s+[^\s]+】/, "") // Removes category titles
    .replace(/（注）.*/s, "") // Removes notes
    .replace(/(令和|平成|昭和)?[0-9０-９]*年度[^\n]*検定試験[^\n]*正解表/s, "") // Removes year and exam headers
    .trim();
}
