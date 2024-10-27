import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { FETCH_REVALIDATE } from "./constants";
import {
  path_api_questions,
  path_api_questions_qualification,
  path_api_questions_qualification_grade,
  path_api_questions_qualification_grade_year,
  path_api_questions_qualification_grade_year_category,
  path_api_questions_qualification_grade_year_category_id,
} from "./path";
import { addBaseUrl } from "./url";
import { QuestionData } from "@/@types/quizType";

const TAG_QUALIFICATIONS = "qualifications";
const TAG_GRADES = "grades";
const TAG_YEARS = "years";
const TAG_CATEGORIES = "categories";
const TAG_QUESTIONS = "questions";
const TAG_ID = "id";

export function revalidateTagByUpdateQuestions() {
  revalidateTag(TAG_QUALIFICATIONS);
  revalidateTag(TAG_GRADES);
  revalidateTag(TAG_YEARS);
  revalidateTagByUpdateQuestion();
}

export function revalidateTagByUpdateQuestion() {
  revalidateTag(TAG_CATEGORIES);
  revalidateTag(TAG_QUESTIONS);
  revalidateTag(TAG_ID);
}

export async function fetchGetAllQualifications(): Promise<string[]> {
  return fetch(addBaseUrl(path_api_questions().$url().path), {
    method: "GET",
    next: {
      revalidate: FETCH_REVALIDATE,
      tags: [TAG_QUALIFICATIONS],
    },
    headers: {
      Cookie: cookies().toString(),
    },
  }).then((response) => response.json());
}

export async function fetchGetGradesByQualification(
  qualification: string,
): Promise<string[]> {
  return fetch(
    addBaseUrl(path_api_questions_qualification(qualification).$url().path),
    {
      method: "GET",
      next: {
        revalidate: FETCH_REVALIDATE,
        tags: [TAG_GRADES],
      },
      headers: {
        Cookie: cookies().toString(),
      },
    },
  ).then((response) => response.json());
}

export async function fetchGetYearsByQualificationAndGrade(
  qualification: string,
  grade: string,
): Promise<string[]> {
  return fetch(
    addBaseUrl(
      path_api_questions_qualification_grade(qualification, grade).$url().path,
    ),
    {
      method: "GET",
      next: {
        revalidate: FETCH_REVALIDATE,
        tags: [TAG_YEARS],
      },
      headers: {
        Cookie: cookies().toString(),
      },
    },
  ).then((response) => response.json());
}

export async function fetchGetCategories(
  qualification: string,
  grade: string,
  year: string,
): Promise<string[]> {
  return fetch(
    addBaseUrl(
      path_api_questions_qualification_grade_year(
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
        Cookie: cookies().toString(),
      },
    },
  ).then((response) => response.json());
}

export async function fetchGetQuestionsByCategory(
  qualification: string,
  grade: string,
  year: string,
  category: string,
): Promise<QuestionData[]> {
  return fetch(
    addBaseUrl(
      path_api_questions_qualification_grade_year_category(
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
        Cookie: cookies().toString(),
      },
    },
  ).then((response) => response.json());
}

export async function fetchGetQuestionsByCategoryAndId(
  qualification: string,
  grade: string,
  year: string,
  category: string,
  id: number,
): Promise<QuestionData> {
  return fetch(
    addBaseUrl(
      path_api_questions_qualification_grade_year_category_id(
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
        Cookie: cookies().toString(),
      },
    },
  ).then((response) => response.json());
}
