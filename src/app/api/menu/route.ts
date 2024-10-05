import { MenuItem } from "@/@types/quizType";
import { ALL_CATEGORY } from "@/lib/constants";
import {
  getQuestions,
  getAllQualifications,
  getCategories,
  getQuestionsByCategory,
  existsData,
  getGradesByQualification,
  getYearsByQualificationAndGrade,
} from "@/services/quizService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // URLからクエリパラメータを取得
  const { searchParams } = new URL(req.url);
  const path = decodeURIComponent(searchParams.get("path") as string);

  // パスが取得できなかった場合のエラーハンドリング
  if (!path) {
    return NextResponse.json({ error: "Path is required" }, { status: 400 });
  }

  const menuItems: MenuItem[] = await getMenuItems(path);

  return NextResponse.json(menuItems);
}

// 正規表現を使用してURLをパース
const quizUrlPattern =
  /^\/quiz\/([^\/]+)\/([^\/]+)\/([^\/]+)\/([^\/]+)\/[^\/]+$/;

/**
 * 現在のURLが `/quiz/[qualification]/[grade]/[year]/[category]/[id]` にマッチするかを判定し、
 * マッチする場合は `{ qualification, grade, year, category }` を返す。
 */
const parseCurrentUrl = (
  url: string
): {
  qualification: string;
  grade: string;
  year: string;
  category: string;
} | null => {
  const match = url.match(quizUrlPattern);
  if (match) {
    const [, qualification, grade, year, category] = match;
    return { qualification, grade, year, category };
  }
  return null;
};

// 資格ごとのメニュー項目を取得
const getQualificationItems = async (): Promise<MenuItem[]> => {
  const qualifications = await getAllQualifications();
  return Promise.all(
    qualifications.map(async (qualification) => {
      const yearItems = await getGradeItemsByQualification(qualification);
      return {
        name: qualification,
        href: `/quiz/${encodeURIComponent(qualification)}`,
        children: yearItems,
      };
    })
  );
};

// 級ごとのメニュー項目を取得
const getGradeItemsByQualification = async (
  qualification: string
): Promise<MenuItem[]> => {
  const grades = await getGradesByQualification(qualification);
  return Promise.all(
    grades.map(async (grade) => {
      const yearsItems = await getYearItemsByQualificationAndGrade(
        qualification,
        grade
      );
      return {
        name: `${grade}級`,
        href: `/quiz/${encodeURIComponent(qualification)}/${encodeURIComponent(
          grade
        )}`,
        children: yearsItems,
      };
    })
  );
};

// 年度ごとのメニュー項目を取得
const getYearItemsByQualificationAndGrade = async (
  qualification: string,
  grade: string
): Promise<MenuItem[]> => {
  const years = await getYearsByQualificationAndGrade(qualification, grade);
  return Promise.all(
    years.map(async (year) => {
      const categoryItems = await getCategoryItemsByGradeAndYear(
        qualification,
        grade,
        year
      );
      return {
        name: year,
        href: `/quiz/${encodeURIComponent(qualification)}/${encodeURIComponent(
          grade
        )}/${encodeURIComponent(year)}`,
        children: categoryItems,
      };
    })
  );
};

// カテゴリごとのメニュー項目を取得
const getCategoryItemsByGradeAndYear = async (
  qualification: string,
  grade: string,
  year: string
): Promise<MenuItem[]> => {
  const categories = await getCategories(qualification, grade, year);
  const allCategories = [ALL_CATEGORY, ...categories];

  return allCategories.map((category) => ({
    name: category === ALL_CATEGORY ? "全ての問題" : category,
    href: `/quiz/${encodeURIComponent(qualification)}/${encodeURIComponent(
      grade
    )}/${encodeURIComponent(year)}/${encodeURIComponent(category)}`,
  }));
};

// 現在のURLに基づいて解いている問題のメニュー項目を取得
const getCurrentQuestionItems = async (
  currentUrl: string
): Promise<MenuItem[]> => {
  const parsedUrl = parseCurrentUrl(currentUrl);
  if (!parsedUrl) return [];

  const { qualification, grade, year, category } = parsedUrl;
  if (!existsData(qualification, grade, year)) return [];

  const questions =
    category === ALL_CATEGORY
      ? await getQuestions(qualification, grade, year)
      : await getQuestionsByCategory(qualification, grade, year, category);

  return questions.map((question) => ({
    name: `問題 ${question.questionId}`,
    href: `/quiz/${encodeURIComponent(qualification)}/${encodeURIComponent(
      grade
    )}/${encodeURIComponent(year)}/${encodeURIComponent(
      category
    )}/${encodeURIComponent(question.questionId)}`,
  }));
};

// メニュー項目を取得するメイン関数
const getMenuItems = async (currentUrl: string): Promise<MenuItem[]> => {
  const questiosItems = await getQualificationItems();
  const menuItems: MenuItem[] = [
    {
      name: "ホーム",
      href: "/",
    },
    {
      name: "資格",
      children: questiosItems,
    },
  ];

  // 現在解いている問題のメニュー項目を追加
  const currentQuestionItems = await getCurrentQuestionItems(currentUrl);
  if (currentQuestionItems.length > 0) {
    menuItems.push({
      name: "解答中の問題一覧",
      children: currentQuestionItems,
    });
  }

  return menuItems;
};
