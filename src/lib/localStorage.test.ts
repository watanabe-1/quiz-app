/**
 * @jest-environment jsdom
 */

import { AnswerHistory, CustomizableLocalStorage } from "@/@types/quizType";
import {
  getAnswerHistory,
  setAnswerHistory,
  createAnswerHistoryKey,
  deleteHistoryByQualificationAndYear,
  getHistoryByQualificationAndYear,
} from "@/lib/localStorage";

afterAll(() => {
  global.localStorage.clear();
});

describe("Answer History Utility Functions", () => {
  test("getAnswerHistory should return an empty object when no history is stored", () => {
    expect(getAnswerHistory()).toEqual({});
  });

  test("setAnswerHistory should save the answer history to localStorage", () => {
    const history: AnswerHistory = { sampleKey: 1 };
    setAnswerHistory(history);

    const storedHistory = JSON.parse(
      (localStorage as unknown as CustomizableLocalStorage)
        .answerHistory as string,
    );
    expect(storedHistory).toEqual(history);
  });

  test("getAnswerHistory should retrieve stored answer history from localStorage", () => {
    const history: AnswerHistory = { sampleKey: 1 };
    (localStorage as unknown as CustomizableLocalStorage).answerHistory =
      JSON.stringify(history);

    expect(getAnswerHistory()).toEqual(history);
  });

  test("createAnswerHistoryKey should generate a unique key based on parameters", () => {
    const qualification = "Math";
    const grade = "A";
    const year = "2024";
    const questionId = 1;

    const key = createAnswerHistoryKey(qualification, grade, year, questionId);
    expect(key).toBe("Math-A-2024-1");
  });

  test("deleteHistoryByQualificationAndYear should remove entries matching qualification, grade, and year", () => {
    const history: AnswerHistory = {
      "Math-A-2024-1": 1,
      "Math-A-2024-2": 2,
      "Science-B-2024-1": 3,
    };
    (localStorage as unknown as CustomizableLocalStorage).answerHistory =
      JSON.stringify(history);

    deleteHistoryByQualificationAndYear("Math", "A", "2024");

    const updatedHistory = getAnswerHistory();
    expect(updatedHistory).toEqual({ "Science-B-2024-1": 3 });
  });

  test("getHistoryByQualificationAndYear should return only entries matching qualification, grade, and year", () => {
    const history: AnswerHistory = {
      "Math-A-2024-1": 1,
      "Math-A-2024-2": 2,
      "Science-B-2024-1": 3,
    };
    (localStorage as unknown as CustomizableLocalStorage).answerHistory =
      JSON.stringify(history);

    const result = getHistoryByQualificationAndYear("Math", "A", "2024");
    expect(result).toEqual({
      "Math-A-2024-1": 1,
      "Math-A-2024-2": 2,
    });
  });
});
