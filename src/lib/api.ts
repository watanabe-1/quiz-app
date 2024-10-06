import { createApiUrl } from "@/lib/url";
import { FETCH_REVALIDATE } from "./constants";
import { QuestionData } from "@/@types/quizType";

const TAG_QUALIFICATIONS = "qualifications";
const TAG_GRADES = "grades";
const TAG_YEARS = "years";
const TAG_CATEGORIES = "categories";
const TAG_QUESTIONS = "questions";
const TAG_ID = "id";

export async function fetchGetAllQualifications(): Promise<string[]> {
  return fetch(createApiUrl("api/questions"), {
    method: "GET",
    next: {
      revalidate: FETCH_REVALIDATE,
      tags: [TAG_QUALIFICATIONS],
    },
  }).then((response) => response.json());
}

export async function fetchGetGradesByQualification(
  qualification: string
): Promise<string[]> {
  return fetch(createApiUrl("api/questions", qualification), {
    method: "GET",
    next: {
      revalidate: FETCH_REVALIDATE,
      tags: [TAG_GRADES],
    },
  }).then((response) => response.json());
}

export async function fetchGetYearsByQualificationAndGrade(
  qualification: string,
  grade: string
): Promise<string[]> {
  return fetch(createApiUrl("api/questions", qualification, grade), {
    method: "GET",
    next: {
      revalidate: FETCH_REVALIDATE,
      tags: [TAG_YEARS],
    },
  }).then((response) => response.json());
}

export async function fetchGetCategories(
  qualification: string,
  grade: string,
  year: string
): Promise<string[]> {
  return fetch(createApiUrl("api/questions", qualification, grade, year), {
    method: "GET",
    next: {
      revalidate: FETCH_REVALIDATE,
      tags: [TAG_CATEGORIES],
    },
  }).then((response) => response.json());
}

export async function fetchGetQuestionsByCategory(
  qualification: string,
  grade: string,
  year: string,
  category: string
): Promise<QuestionData[]> {
  return fetch(
    createApiUrl("api/questions", qualification, grade, year, category),
    {
      method: "GET",
      next: {
        revalidate: FETCH_REVALIDATE,
        tags: [TAG_QUESTIONS],
      },
    }
  ).then((response) => response.json());
}

export async function fetchGetQuestionsByCategoryAndId(
  qualification: string,
  grade: string,
  year: string,
  category: string,
  id: number
): Promise<QuestionData> {
  return fetch(
    createApiUrl("api/questions", qualification, grade, year, category, id),
    {
      method: "GET",
      next: {
        revalidate: FETCH_REVALIDATE,
        tags: [TAG_ID],
      },
    }
  ).then((response) => response.json());
}
