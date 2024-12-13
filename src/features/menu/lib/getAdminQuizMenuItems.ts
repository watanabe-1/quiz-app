import {
  fetchGetAllQualifications,
  fetchGetGradesByQualification,
  fetchGetYearsByQualificationAndGrade,
  fetchGetQuestionsByCategory,
} from "@/lib/api";
import { ALL_CATEGORY } from "@/lib/constants";
import {
  path_admin_Dqualification_Dgrade_Dyear_edit_Did,
  path_admin_Dqualification,
  path_admin_Dqualification_Dgrade,
  path_admin_Dqualification_Dgrade_Dyear,
} from "@/lib/path";
import { MenuItem } from "@/types/quizType";

/**
 * 現在のURLが `/admin/[qualification]/[grade]/[year]/edit/[id]` にマッチするかを判定し、
 * マッチする場合は `{ qualification, grade, year }` を返す。
 */
export const parseAdminQuizCurrentUrl = (
  url: string,
): {
  qualification: string;
  grade: string;
  year: string;
} | null => {
  const match = path_admin_Dqualification_Dgrade_Dyear_edit_Did.match(url);

  if (match) {
    const { qualification, grade, year } = match;

    return { qualification, grade, year };
  }

  return null;
};

// 資格ごとのメニュー項目を取得
export const getAdminQualificationItems = async (): Promise<MenuItem[]> => {
  const qualifications = await fetchGetAllQualifications();

  return Promise.all(
    qualifications.map(async (qualification) => {
      const yearItems = await getAdminGradeItemsByQualification(qualification);

      return {
        name: qualification,
        href: path_admin_Dqualification(qualification).$url().path,
        children: yearItems,
      };
    }),
  );
};

// 級ごとのメニュー項目を取得
export const getAdminGradeItemsByQualification = async (
  qualification: string,
): Promise<MenuItem[]> => {
  const grades = await fetchGetGradesByQualification(qualification);

  return Promise.all(
    grades.map(async (grade) => {
      const yearsItems = await getAdminYearItemsByQualificationAndGrade(
        qualification,
        grade,
      );

      return {
        name: grade,
        href: path_admin_Dqualification_Dgrade(qualification, grade).$url()
          .path,
        children: yearsItems,
      };
    }),
  );
};

// 年度ごとのメニュー項目を取得
export const getAdminYearItemsByQualificationAndGrade = async (
  qualification: string,
  grade: string,
): Promise<MenuItem[]> => {
  const years = await fetchGetYearsByQualificationAndGrade(
    qualification,
    grade,
  );

  return Promise.all(
    years.map(async (year) => {
      return {
        name: year,
        href: path_admin_Dqualification_Dgrade_Dyear(
          qualification,
          grade,
          year,
        ).$url().path,
      };
    }),
  );
};

// 現在のURLに基づいて解いている問題のメニュー項目を取得
export const getAdminCurrentQuestionItems = async (
  currentUrl: string,
): Promise<MenuItem[]> => {
  const parsedUrl = parseAdminQuizCurrentUrl(currentUrl);
  if (!parsedUrl) return [];

  const { qualification, grade, year } = parsedUrl;
  const category = ALL_CATEGORY;

  const questions = await fetchGetQuestionsByCategory(
    qualification,
    grade,
    year,
    category,
  );

  return questions.map((question) => ({
    name: `問題 ${question.questionId}`,
    href: path_admin_Dqualification_Dgrade_Dyear_edit_Did(
      qualification,
      grade,
      year,
      question.questionId,
    ).$url().path,
  }));
};
