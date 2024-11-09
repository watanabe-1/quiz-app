import { createAnswerHistoryKey } from "@/lib/localStorage";
import { AnswerHistory, QuestionAnswerPair } from "@/types/quizType";

export const calculateCorrectCount = (
  questionIdAnswers: QuestionAnswerPair[],
  qualification: string,
  grade: string,
  year: string,
  history: AnswerHistory,
): number => {
  return questionIdAnswers.reduce((count, idAnswer) => {
    const key = createAnswerHistoryKey(
      qualification,
      grade,
      year,
      idAnswer.questionId,
    );
    const storedAnswer = history[key];
    if (storedAnswer === idAnswer.answer) {
      return count + 1;
    }
    return count;
  }, 0);
};

export const calculateAnsweredCount = (
  questionIdAnswers: QuestionAnswerPair[],
  qualification: string,
  grade: string,
  year: string,
  history: AnswerHistory,
): number => {
  return questionIdAnswers.reduce((count, idAnswer) => {
    const key = createAnswerHistoryKey(
      qualification,
      grade,
      year,
      idAnswer.questionId,
    );
    if (history[key] !== undefined) {
      return count + 1;
    }
    return count;
  }, 0);
};
