import {
  calculateCorrectCount,
  calculateAnsweredCount,
} from "@/components/quiz/Question/quizUtils";
import { createAnswerHistoryKey } from "@/lib/localStorage";
import { AnswerHistory, QuestionAnswerPair } from "@/types/quizType";

jest.mock("@/lib/localStorage", () => ({
  createAnswerHistoryKey: jest.fn(),
}));

describe("Quiz answer calculations", () => {
  const qualification = "exampleQualification";
  const grade = "exampleGrade";
  const year = "2024";

  const mockCreateAnswerHistoryKey = createAnswerHistoryKey as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("calculateCorrectCount", () => {
    it("should return the correct count of correct answers", () => {
      const questionIdAnswers: QuestionAnswerPair[] = [
        { questionId: 1, answer: 1 },
        { questionId: 2, answer: 2 },
        { questionId: 3, answer: 3 },
      ];
      const history: AnswerHistory = {
        key1: 1,
        key2: 2,
        key3: 4,
      };

      mockCreateAnswerHistoryKey
        .mockImplementationOnce(() => "key1")
        .mockImplementationOnce(() => "key2")
        .mockImplementationOnce(() => "key3");

      const correctCount = calculateCorrectCount(
        questionIdAnswers,
        qualification,
        grade,
        year,
        history,
      );

      expect(correctCount).toBe(2); // Only questionId 1 and 2 match
      expect(mockCreateAnswerHistoryKey).toHaveBeenCalledTimes(3);
    });

    it("should return zero if there are no correct answers", () => {
      const questionIdAnswers: QuestionAnswerPair[] = [
        { questionId: 1, answer: 1 },
        { questionId: 2, answer: 2 },
      ];
      const history: AnswerHistory = {
        key1: 3,
        key2: 4,
      };

      mockCreateAnswerHistoryKey
        .mockImplementationOnce(() => "key1")
        .mockImplementationOnce(() => "key2");

      const correctCount = calculateCorrectCount(
        questionIdAnswers,
        qualification,
        grade,
        year,
        history,
      );

      expect(correctCount).toBe(0);
    });
  });

  describe("calculateAnsweredCount", () => {
    it("should return the count of answered questions", () => {
      const questionIdAnswers: QuestionAnswerPair[] = [
        { questionId: 1, answer: 1 },
        { questionId: 2, answer: 2 },
        { questionId: 3, answer: 3 },
      ];
      const history: AnswerHistory = {
        key1: 1,
        key2: 2,
      };

      mockCreateAnswerHistoryKey
        .mockImplementationOnce(() => "key1")
        .mockImplementationOnce(() => "key2")
        .mockImplementationOnce(() => "key3");

      const answeredCount = calculateAnsweredCount(
        questionIdAnswers,
        qualification,
        grade,
        year,
        history,
      );

      expect(answeredCount).toBe(2); // Only questionId 1 and 2 are in history
      expect(mockCreateAnswerHistoryKey).toHaveBeenCalledTimes(3);
    });

    it("should return zero if there are no answered questions", () => {
      const questionIdAnswers: QuestionAnswerPair[] = [
        { questionId: 1, answer: 1 },
        { questionId: 2, answer: 2 },
      ];
      const history: AnswerHistory = {};

      mockCreateAnswerHistoryKey
        .mockImplementationOnce(() => "key1")
        .mockImplementationOnce(() => "key2");

      const answeredCount = calculateAnsweredCount(
        questionIdAnswers,
        qualification,
        grade,
        year,
        history,
      );

      expect(answeredCount).toBe(0);
    });
  });
});
