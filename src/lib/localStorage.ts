"use client";

import { ANSWER_HISTORY_KEY } from "./constants";
import { AnswerHistory } from "@/@types/quizType";

// Utility function to get history from localStorage
export const getAnswerHistory = (): AnswerHistory => {
  if (typeof window === "undefined") {
    return {};
  }

  const historyString = localStorage.getItem(ANSWER_HISTORY_KEY);

  if (!historyString) {
    return {};
  }

  try {
    const parsedHistory: AnswerHistory = JSON.parse(historyString);
    return parsedHistory;
  } catch (error) {
    console.error("Failed to parse answer history:", error);
    return {};
  }
};

// Utility function to set history in localStorage
export const setAnswerHistory = (history: AnswerHistory): void => {
  localStorage.setItem(ANSWER_HISTORY_KEY, JSON.stringify(history));
};

// Utility function to create a history key
export const createAnswerHistoryKey = (
  qualification: string,
  grade: string,
  year: string,
  questionId: number
): string => {
  return `${qualification}-${grade}-${year}-${questionId}`;
};

// Utility function to delete all history entries with a matching qualification and year
export const deleteHistoryByQualificationAndYear = (
  qualification: string,
  grade: string,
  year: string
): void => {
  const history = getAnswerHistory();

  // Create the keyPrefix using the qualification and grade and year
  const keyPrefix = `${qualification}-${grade}-${year}`;

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
  grade: string,
  year: string
): AnswerHistory => {
  const history = getAnswerHistory();

  // Create the keyPrefix using the qualification and grade and year
  const keyPrefix = `${qualification}-${grade}-${year}`;

  // Filter the history to return only the matching entries
  const filteredHistory: AnswerHistory = {};

  Object.keys(history).forEach((key) => {
    if (key.startsWith(keyPrefix)) {
      filteredHistory[key] = history[key];
    }
  });

  return filteredHistory;
};
