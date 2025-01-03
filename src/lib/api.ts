import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { FETCH_REVALIDATE } from "@/lib/constants";
import {
  path_api_questions,
  path_api_questions_Dqualification,
  path_api_questions_Dqualification_Dgrade,
  path_api_questions_Dqualification_Dgrade_Dyear,
  path_api_questions_Dqualification_Dgrade_Dyear_Dcategory,
  path_api_questions_Dqualification_Dgrade_Dyear_Dcategory_Did,
} from "@/lib/path";
import { addBaseUrl } from "@/lib/url";
import { QuestionData } from "@/types/quizType";

const TAG_QUALIFICATIONS = "qualifications";
const TAG_GRADES = "grades";
const TAG_YEARS = "years";
const TAG_CATEGORIES = "categories";
const TAG_QUESTIONS = "questions";
const TAG_ID = "id";

/**
 * Revalidates cache tags for qualifications, grades, and years, along with questions.
 */
export function revalidateTagByUpdateQuestions() {
  revalidateTag(TAG_QUALIFICATIONS);
  revalidateTag(TAG_GRADES);
  revalidateTag(TAG_YEARS);
  revalidateTagByUpdateQuestion();
}

/**
 * Revalidates cache tags for categories, questions, and specific question ID.
 */
export function revalidateTagByUpdateQuestion() {
  revalidateTag(TAG_CATEGORIES);
  revalidateTag(TAG_QUESTIONS);
  revalidateTag(TAG_ID);
}

/**
 * Fetches all available qualifications.
 * @returns {Promise<string[]>} - A promise resolving to a list of qualifications.
 */
export async function fetchGetAllQualifications(): Promise<string[]> {
  return fetch(await addBaseUrl(path_api_questions().$url().path), {
    method: "GET",
    next: {
      revalidate: FETCH_REVALIDATE,
      tags: [TAG_QUALIFICATIONS],
    },
    headers: {
      Cookie: (await cookies()).toString(),
    },
  }).then((response) => response.json());
}

/**
 * Fetches all grades for a specific qualification.
 * @param qualification - The qualification identifier.
 * @returns {Promise<string[]>} - A promise resolving to a list of grades.
 */
export async function fetchGetGradesByQualification(
  qualification: string,
): Promise<string[]> {
  return fetch(
    await addBaseUrl(
      path_api_questions_Dqualification(qualification).$url().path,
    ),
    {
      method: "GET",
      next: {
        revalidate: FETCH_REVALIDATE,
        tags: [TAG_GRADES],
      },
      headers: {
        Cookie: (await cookies()).toString(),
      },
    },
  ).then((response) => response.json());
}

/**
 * Fetches all years for a specific qualification and grade.
 * @param qualification - The qualification identifier.
 * @param grade - The grade level.
 * @returns {Promise<string[]>} - A promise resolving to a list of years.
 */
export async function fetchGetYearsByQualificationAndGrade(
  qualification: string,
  grade: string,
): Promise<string[]> {
  return fetch(
    await addBaseUrl(
      path_api_questions_Dqualification_Dgrade(qualification, grade).$url()
        .path,
    ),
    {
      method: "GET",
      next: {
        revalidate: FETCH_REVALIDATE,
        tags: [TAG_YEARS],
      },
      headers: {
        Cookie: (await cookies()).toString(),
      },
    },
  ).then((response) => response.json());
}

/**
 * Fetches all categories for a given qualification, grade, and year.
 * @param qualification - The qualification identifier.
 * @param grade - The grade level.
 * @param year - The year of examination.
 * @returns {Promise<string[]>} - A promise resolving to a list of categories.
 */
export async function fetchGetCategories(
  qualification: string,
  grade: string,
  year: string,
): Promise<string[]> {
  return fetch(
    await addBaseUrl(
      path_api_questions_Dqualification_Dgrade_Dyear(
        qualification,
        grade,
        year,
      ).$url().path,
    ),
    {
      method: "GET",
      next: {
        revalidate: FETCH_REVALIDATE,
        tags: [TAG_CATEGORIES],
      },
      headers: {
        Cookie: (await cookies()).toString(),
      },
    },
  ).then((response) => response.json());
}

/**
 * Fetches questions by category for a specified qualification, grade, year, and category.
 * @param qualification - The qualification identifier.
 * @param grade - The grade level.
 * @param year - The year of examination.
 * @param category - The question category.
 * @returns {Promise<QuestionData[]>} - A promise resolving to an array of question data.
 */
export async function fetchGetQuestionsByCategory(
  qualification: string,
  grade: string,
  year: string,
  category: string,
): Promise<QuestionData[]> {
  return fetch(
    await addBaseUrl(
      path_api_questions_Dqualification_Dgrade_Dyear_Dcategory(
        qualification,
        grade,
        year,
        category,
      ).$url().path,
    ),
    {
      method: "GET",
      next: {
        revalidate: FETCH_REVALIDATE,
        tags: [TAG_QUESTIONS],
      },
      headers: {
        Cookie: (await cookies()).toString(),
      },
    },
  ).then((response) => response.json());
}

/**
 * Fetches a specific question by ID within a given qualification, grade, year, and category.
 * @param qualification - The qualification identifier.
 * @param grade - The grade level.
 * @param year - The year of examination.
 * @param category - The question category.
 * @param id - The unique identifier of the question.
 * @returns {Promise<QuestionData>} - A promise resolving to the question data.
 */
export async function fetchGetQuestionsByCategoryAndId(
  qualification: string,
  grade: string,
  year: string,
  category: string,
  id: number,
): Promise<QuestionData> {
  return fetch(
    await addBaseUrl(
      path_api_questions_Dqualification_Dgrade_Dyear_Dcategory_Did(
        qualification,
        grade,
        year,
        category,
        id,
      ).$url().path,
    ),
    {
      method: "GET",
      next: {
        revalidate: FETCH_REVALIDATE,
        tags: [TAG_ID],
      },
      headers: {
        Cookie: (await cookies()).toString(),
      },
    },
  ).then((response) => response.json());
}
