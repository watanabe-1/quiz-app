"use client";

import { createLocalStorageProxy } from "@/lib/proxies/createLocalStorageProxy";
import { AnswerHistory } from "@/types/quizType";

/**
 * A proxy instance of CustomizableLocalStorage, allowing direct access
 * to localStorage items through properties such as `answerHistory`.
 * This proxy enables convenient retrieval and setting of localStorage
 * values, automatically handling JSON parsing and stringifying as needed.
 *
 * @example
 * ```typescript
 * // Get the answer history
 * const history = localStorageProxy.answerHistory;
 *
 * // Set the answer history
 * localStorageProxy.answerHistory = JSON.stringify({ key: 'value' });
 *
 * // Remove the answer history
 * localStorageProxy.answerHistory = undefined;
 * ```
 */
const localStorageProxy = createLocalStorageProxy();

/**
 * Retrieves the answer history from localStorage.
 *
 * @returns {AnswerHistory} An object representing the answer history.
 * If no history exists or parsing fails, an empty object is returned.
 */
export const getAnswerHistory = (): AnswerHistory => {
  if (typeof window === "undefined") {
    return {};
  }

  const historyString = localStorageProxy.answerHistory;
  if (!historyString) {
    return {};
  }

  try {
    const parsedHistory: AnswerHistory = JSON.parse(historyString);

    return typeof parsedHistory === "object" ? parsedHistory : {};
  } catch (error) {
    console.error("Failed to parse answer history:", error);

    return {};
  }
};

/**
 * Stores the given answer history in localStorage.
 *
 * @param {AnswerHistory} history - The answer history object to store.
 */
export const setAnswerHistory = (history: AnswerHistory): void => {
  if (typeof window === "undefined") return;

  try {
    localStorageProxy.answerHistory = JSON.stringify(history);
  } catch (error) {
    console.error("Failed to set answer history:", error);
  }
};

/**
 * Creates a unique key for a specific answer history entry based on qualification, grade, year, and question ID.
 *
 * @param {string} qualification - The name of the qualification.
 * @param {string} grade - The grade level.
 * @param {string} year - The year of the examination.
 * @param {number} questionId - The question identifier.
 * @returns {string} A unique key for the answer history entry.
 */
export const createAnswerHistoryKey = (
  qualification: string,
  grade: string,
  year: string,
  questionId: number,
): string => `${qualification}-${grade}-${year}-${questionId}`;

/**
 * Deletes all entries in answer history that match the specified qualification, grade, and year.
 *
 * @param {string} qualification - The qualification name to filter by.
 * @param {string} grade - The grade level to filter by.
 * @param {string} year - The year to filter by.
 */
export const deleteHistoryByQualificationAndYear = (
  qualification: string,
  grade: string,
  year: string,
): void => {
  if (typeof window === "undefined") return;

  const history = getAnswerHistory();
  const keyPrefix = `${qualification}-${grade}-${year}`;

  Object.keys(history).forEach((key) => {
    if (key.startsWith(keyPrefix)) {
      delete history[key];
    }
  });

  setAnswerHistory(history);
};

/**
 * Retrieves all entries in answer history that match the specified qualification, grade, and year.
 *
 * @param {string} qualification - The qualification name to filter by.
 * @param {string} grade - The grade level to filter by.
 * @param {string} year - The year to filter by.
 * @returns {AnswerHistory} A filtered answer history object containing only the matching entries.
 */
export const getHistoryByQualificationAndYear = (
  qualification: string,
  grade: string,
  year: string,
): AnswerHistory => {
  const history = getAnswerHistory();
  const keyPrefix = `${qualification}-${grade}-${year}`;
  const filteredHistory: AnswerHistory = {};

  Object.keys(history).forEach((key) => {
    if (key.startsWith(keyPrefix)) {
      filteredHistory[key] = history[key];
    }
  });

  return filteredHistory;
};
