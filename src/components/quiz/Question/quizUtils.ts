import { AnswerHistory, QuestionAnswerPair } from "@/@types/quizType";

export const calculateCorrectCount = (
  questionIdAnswers: QuestionAnswerPair[],
  qualification: string,
  year: string,
  history: AnswerHistory
): number => {
  return questionIdAnswers.reduce((count, idAnswer) => {
    const storedAnswer =
      history[`${qualification}-${year}-${idAnswer.questionId}`];
    if (storedAnswer === idAnswer.answer) {
      return count + 1;
    }
    return count;
  }, 0);
};

export const calculateAnsweredCount = (
  questionIdAnswers: QuestionAnswerPair[],
  qualification: string,
  year: string,
  history: AnswerHistory
): number => {
  return questionIdAnswers.reduce((count, idAnswer) => {
    if (
      history[`${qualification}-${year}-${idAnswer.questionId}`] !== undefined
    ) {
      return count + 1;
    }
    return count;
  }, 0);
};
