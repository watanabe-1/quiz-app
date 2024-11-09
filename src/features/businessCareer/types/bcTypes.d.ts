/**
 * Represents the data structure for a question with two answers.
 */
export interface AnswerData {
  /**
   * The question number.
   */
  questionNumber: number;

  /**
   * The first part of the answer (e.g., for the first half of a multiple-choice question).
   */
  answer1: string;

  /**
   * The second part of the answer (e.g., for the second half of a multiple-choice question).
   */
  answer2: string;
}

/**
 * Represents a single answer with a question number.
 */
export interface Answer {
  /**
   * The question number associated with this answer.
   */
  questionNumber: number;

  /**
   * The answer text (e.g., a selected option like "A", "B", etc.).
   */
  answer: string;
}

/**
 * Represents a collection of answers grouped by a category.
 */
export interface CategoryAnswers {
  /**
   * The category name (e.g., "HR Management").
   */
  category: string;

  /**
   * An array of answers for questions in this category.
   */
  answers: Answer[];
}

/**
 * Represents the data structure for an entire exam, including the year and categories.
 */
export interface ExamData {
  /**
   * The year of the exam (e.g., "2024").
   */
  year: string;

  /**
   * An array of categories, each containing a list of answers.
   */
  categories: CategoryAnswers[];
}

/**
 * Represents the data structure for submitting a Business Career Certification (BCC) exam PDF upload.
 */
export type UploadBccExamSubmit = {
  /**
   * The PDF file to be uploaded.
   */
  pdf: File;
};
