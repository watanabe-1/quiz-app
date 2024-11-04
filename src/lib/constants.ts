import { NonLinkableSegment } from "@/@types/quizType";

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
  Array.from(katakanaToNumbersMap, ([katakana, number]) => [number, katakana]),
);

export const nonLinkableSegmentsByQuiz = [
  { label: "quiz", index: 0 } as NonLinkableSegment, // 'quiz' is the first part of the URL
];

export const nonLinkableSegmentsByAdmin = [
  { label: "edit", index: 4 } as NonLinkableSegment, // 'edit' is the fifth part of the URL
];

// fetchのcash保持時間 31日
// 基本的にはrevalidateTag()を使用してキャッシュの破棄を行う想定
export const FETCH_REVALIDATE = 2678400;
