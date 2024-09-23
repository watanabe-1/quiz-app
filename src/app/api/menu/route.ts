import { MenuItem } from "@/@types/quizType";
import { ALL_CATEGORY } from "@/lib/constants";
import {
  getQuestions,
  getAllQualifications,
  getYearsByQualification,
  getCategories,
  existsFile,
  getQuestionsByCategory,
} from "@/lib/questions";
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
const quizUrlPattern = /^\/quiz\/([^\/]+)\/([^\/]+)\/([^\/]+)\/[^\/]+$/;

/**
 * 現在のURLが `/quiz/[qualification]/[year]/[category]/[id]` にマッチするかを判定し、
 * マッチする場合は `{ qualification, year, category }` を返す。
 */
const parseCurrentUrl = (
  url: string
): { qualification: string; year: string; category: string } | null => {
  const match = url.match(quizUrlPattern);
  if (match) {
    const [, qualification, year, category] = match;
    return { qualification, year, category };
  }
  return null;
};

// 資格ごとのメニュー項目を取得
const getQualificationItems = async (): Promise<MenuItem[]> => {
  const qualifications = await getAllQualifications();
  return Promise.all(
    qualifications.map(async (qualification) => {
      const yearItems = await getYearItemsByQualification(qualification);
      return {
        name: qualification,
        href: `/quiz/${encodeURIComponent(qualification)}`,
        children: yearItems,
      };
    })
  );
};

// 年度ごとのメニュー項目を取得
const getYearItemsByQualification = async (
  qualification: string
): Promise<MenuItem[]> => {
  const years = await getYearsByQualification(qualification);
  return Promise.all(
    years.map(async (year) => {
      const categoryItems = await getCategoryItemsByYear(qualification, year);
      return {
        name: year,
        href: `/quiz/${encodeURIComponent(qualification)}/${encodeURIComponent(
          year
        )}`,
        children: categoryItems,
      };
    })
  );
};

// カテゴリごとのメニュー項目を取得
const getCategoryItemsByYear = async (
  qualification: string,
  year: string
): Promise<MenuItem[]> => {
  const categories = await getCategories(qualification, year);
  const allCategories = [ALL_CATEGORY, ...categories];

  return allCategories.map((category) => ({
    name: category === ALL_CATEGORY ? "全ての問題" : category,
    href: `/quiz/${encodeURIComponent(qualification)}/${encodeURIComponent(
      year
    )}/${encodeURIComponent(category)}`,
  }));
};

// 現在のURLに基づいて解いている問題のメニュー項目を取得
const getCurrentQuestionItems = async (
  currentUrl: string
): Promise<MenuItem[]> => {
  const parsedUrl = parseCurrentUrl(currentUrl);
  if (!parsedUrl) return [];

  const { qualification, year, category } = parsedUrl;
  if (!existsFile(qualification, year)) return [];

  const questions =
    category === ALL_CATEGORY
      ? await getQuestions(qualification, year)
      : await getQuestionsByCategory(qualification, year, category);

  return questions.map((question) => ({
    name: `問題 ${question.id}`,
    href: `/quiz/${encodeURIComponent(qualification)}/${encodeURIComponent(
      year
    )}/${encodeURIComponent(category)}/${encodeURIComponent(question.id)}`,
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
