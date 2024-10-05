export const ALL_CATEGORY = "all";
export const ANSWER_HISTORY_KEY = "answerHistory";

// mapは厳密には定数として宣言できないので、スネーク形式にはしない
export const katakanaToNumbersMap = new Map<string, number>([
  ["ア", 0],
  ["イ", 1],
  ["ウ", 2],
  ["エ", 3],
  ["オ", 4],
]);

export const numberToKatakanaMap = new Map<number, string>(
  Array.from(katakanaToNumbersMap, ([katakana, number]) => [number, katakana])
);

export const HEADERS_URL = "x-url";
export const HEADERS_PATHNAME = "x-pathname";

export const nonLinkableSegmentsByQuiz = [
  { label: "quiz", index: 0 }, // 'quiz' is the first part of the URL
];

export const nonLinkableSegmentsByAdmin = [
  { label: "edit", index: 4 }, // 'edit' is the fifth part of the URL
];
