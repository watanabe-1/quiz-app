"use client";

import { ANSWER_HISTORY_KEY } from "./constants";

// Utility function to get history from localStorage
export const getAnswerHistory = (): Record<string, any> => {
  return JSON.parse(localStorage.getItem(ANSWER_HISTORY_KEY) || "{}");
};

// Utility function to set history in localStorage
export const setAnswerHistory = (history: Record<string, any>): void => {
  localStorage.setItem(ANSWER_HISTORY_KEY, JSON.stringify(history));
};

// Utility function to create a history key
export const createAnswerHistoryKey = (
  qualification: string,
  year: string,
  questionId: number
): string => {
  return `${qualification}-${year}-${questionId}`;
};

// Utility function to delete all history entries with a matching qualification and year
export const deleteHistoryByQualificationAndYear = (
  qualification: string,
  year: string
): void => {
  const history = getAnswerHistory();

  // Create the keyPrefix using the qualification and year
  const keyPrefix = `${qualification}-${year}`;

  // Iterate over the keys in history and delete matching ones
  Object.keys(history).forEach((key) => {
    if (key.startsWith(keyPrefix)) {
      delete history[key];
    }
  });

  // Save the updated history back to localStorage
  setAnswerHistory(history);
};

// Utility function to get all history entries with a matching qualification and year
export const getHistoryByQualificationAndYear = (
  qualification: string,
  year: string
): Record<string, any> => {
  const history = getAnswerHistory();

  // Create the keyPrefix using the qualification and year
  const keyPrefix = `${qualification}-${year}`;

  // Filter the history to return only the matching entries
  const filteredHistory: Record<string, any> = {};

  Object.keys(history).forEach((key) => {
    if (key.startsWith(keyPrefix)) {
      filteredHistory[key] = history[key];
    }
  });

  return filteredHistory;
};
