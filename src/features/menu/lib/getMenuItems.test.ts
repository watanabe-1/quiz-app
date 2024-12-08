/**
 * @jest-environment jsdom
 */

import { auth } from "@/features/auth/auth";
import { getAdminFileMenuItems } from "@/features/menu/lib/getAdminFileMenuItems";
import {
  getAdminQualificationItems,
  getAdminCurrentQuestionItems,
} from "@/features/menu/lib/getAdminQuizMenuItems";
import { getMenuItems } from "@/features/menu/lib/getMenuItems";
import {
  getQualificationItems,
  getCurrentQuestionItems,
} from "@/features/menu/lib/getQuizMenuItems";
import {
  path_admin_Dqualification,
  path_quiz_Dqualification,
} from "@/lib/path";

jest.mock("@/features/auth/auth");
jest.mock("@/features/menu/lib/getAdminFileMenuItems");
jest.mock("@/features/menu/lib/getAdminQuizMenuItems");
jest.mock("@/features/menu/lib/getQuizMenuItems");

// 各関数をモック
const mockAuth = auth as jest.Mock;
const mockGetAdminFileMenuItems = getAdminFileMenuItems as jest.Mock;
const mockGetAdminQualificationItems = getAdminQualificationItems as jest.Mock;
const mockGetAdminCurrentQuestionItems =
  getAdminCurrentQuestionItems as jest.Mock;
const mockGetQualificationItems = getQualificationItems as jest.Mock;
const mockGetCurrentQuestionItems = getCurrentQuestionItems as jest.Mock;

describe("getMenuItems 関数のテスト", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("管理者ユーザーの場合、管理者メニューを含むすべてのメニュー項目を取得", async () => {
    // モックの設定
    mockAuth.mockResolvedValue({ user: { role: "admin" } });
    mockGetAdminQualificationItems.mockResolvedValue([
      { name: "資格A", href: path_admin_Dqualification("資格A").$url().path },
    ]);
    mockGetAdminCurrentQuestionItems.mockResolvedValue([
      { name: "問題 1", href: "/admin/question/1" },
    ]);
    mockGetAdminFileMenuItems.mockReturnValue([
      { name: "ファイルアップロード", href: "/admin/files" },
    ]);
    mockGetQualificationItems.mockResolvedValue([
      { name: "資格B", href: path_quiz_Dqualification("資格B").$url().path },
    ]);
    mockGetCurrentQuestionItems.mockResolvedValue([
      { name: "解答中の問題", href: "/quiz/current" },
    ]);

    const currentUrl = "/quiz/資格B/1級/2024";
    const menuItems = await getMenuItems(currentUrl);

    expect(menuItems).toEqual([
      { name: "ホーム", href: "/" },
      {
        name: "管理者-資格",
        children: [
          {
            name: "資格A",
            href: path_admin_Dqualification("資格A").$url().path,
          },
        ],
      },
      {
        name: "管理者-修正中の問題一覧",
        children: [{ name: "問題 1", href: "/admin/question/1" }],
      },
      {
        name: "管理者-ファイル",
        children: [{ name: "ファイルアップロード", href: "/admin/files" }],
      },
      {
        name: "資格",
        children: [
          {
            name: "資格B",
            href: path_quiz_Dqualification("資格B").$url().path,
          },
        ],
      },
      {
        name: "解答中の問題一覧",
        children: [{ name: "解答中の問題", href: "/quiz/current" }],
      },
    ]);
  });

  test("一般ユーザーの場合、管理者メニューを含まない", async () => {
    // モックの設定
    mockAuth.mockResolvedValue(null);
    mockGetQualificationItems.mockResolvedValue([
      { name: "資格B", href: path_quiz_Dqualification("資格B").$url().path },
    ]);
    mockGetCurrentQuestionItems.mockResolvedValue([
      { name: "解答中の問題", href: "/quiz/current" },
    ]);

    const currentUrl = "/quiz/資格B/1級/2024";
    const menuItems = await getMenuItems(currentUrl);

    expect(menuItems).toEqual([
      { name: "ホーム", href: "/" },
      {
        name: "資格",
        children: [
          {
            name: "資格B",
            href: path_quiz_Dqualification("資格B").$url().path,
          },
        ],
      },
      {
        name: "解答中の問題一覧",
        children: [{ name: "解答中の問題", href: "/quiz/current" }],
      },
    ]);
  });
});
