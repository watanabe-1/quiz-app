import {
  fetchGetAllQualifications,
  fetchGetGradesByQualification,
  fetchGetYearsByQualificationAndGrade,
  fetchGetCategories,
  fetchGetQuestionsByCategory,
} from "@/lib/api";
import { client } from "@/lib/client";
import { ALL_CATEGORY } from "@/lib/constants";
import { MenuItem } from "@/types/quizType";

/**
 * 現在のURLが `/quiz/[qualification]/[grade]/[year]/[category]/[id]` にマッチするかを判定し、
 * マッチする場合は `{ qualification, grade, year, category }` を返す。
 */
export const parseQuizCurrentUrl = (
  url: string,
): {
  qualification: string;
  grade: string;
  year: string;
  category: string;
} | null => {
  const match =
    client.quiz._qualification._grade._year._category._id.$match(url);
  if (match) {
    const { qualification, grade, year, category } = match;

    return { qualification, grade, year, category };
  }

  return null;
};

// 資格ごとのメニュー項目を取得
export const getQualificationItems = async (): Promise<MenuItem[]> => {
  const qualifications = await fetchGetAllQualifications();

  return Promise.all(
    qualifications.map(async (qualification) => {
      const yearItems = await getGradeItemsByQualification(qualification);

      return {
        name: qualification,
        href: client.quiz._qualification(qualification).$url().path,
        children: yearItems,
      };
    }),
  );
};

// 級ごとのメニュー項目を取得
export const getGradeItemsByQualification = async (
  qualification: string,
): Promise<MenuItem[]> => {
  const grades = await fetchGetGradesByQualification(qualification);

  return Promise.all(
    grades.map(async (grade) => {
      const yearsItems = await getYearItemsByQualificationAndGrade(
        qualification,
        grade,
      );

      return {
        name: grade,
        href: client.quiz._qualification(qualification)._grade(grade).$url()
          .path,
        children: yearsItems,
      };
    }),
  );
};

// 年度ごとのメニュー項目を取得
export const getYearItemsByQualificationAndGrade = async (
  qualification: string,
  grade: string,
): Promise<MenuItem[]> => {
  const years = await fetchGetYearsByQualificationAndGrade(
    qualification,
    grade,
  );

  return Promise.all(
    years.map(async (year) => {
      const categoryItems = await getCategoryItemsByGradeAndYear(
        qualification,
        grade,
        year,
      );

      return {
        name: year,
        href: client.quiz
          ._qualification(qualification)
          ._grade(grade)
          ._year(year)
          .$url().path,
        children: categoryItems,
      };
    }),
  );
};

// カテゴリごとのメニュー項目を取得
export const getCategoryItemsByGradeAndYear = async (
  qualification: string,
  grade: string,
  year: string,
): Promise<MenuItem[]> => {
  const categories = await fetchGetCategories(qualification, grade, year);
  const allCategories = [ALL_CATEGORY, ...categories];

  return allCategories.map((category) => ({
    name: category === ALL_CATEGORY ? "全ての問題" : category,
    href: client.quiz
      ._qualification(qualification)
      ._grade(grade)
      ._year(year)
      ._category(category)
      .$url().path,
  }));
};

// 現在のURLに基づいて解いている問題のメニュー項目を取得
export const getCurrentQuestionItems = async (
  currentUrl: string,
): Promise<MenuItem[]> => {
  const parsedUrl = parseQuizCurrentUrl(currentUrl);
  if (!parsedUrl) return [];

  const { qualification, grade, year, category } = parsedUrl;

  const questions = await fetchGetQuestionsByCategory(
    qualification,
    grade,
    year,
    category,
  );

  return questions.map((question) => ({
    name: `問題 ${question.questionId}`,
    href: client.quiz
      ._qualification(qualification)
      ._grade(grade)
      ._year(year)
      ._category(category)
      ._id(question.questionId)
      .$url().path,
  }));
};
