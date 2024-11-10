import { auth } from "@/features/auth/auth";
import { getAdminFileMenuItems } from "@/lib/menu/getAdminFileMenuItems";
import {
  getAdminCurrentQuestionItems,
  getAdminQualificationItems,
} from "@/lib/menu/getAdminQuizMenuItems";
import {
  getQualificationItems,
  getCurrentQuestionItems,
} from "@/lib/menu/getQuizMenuItems";
import { path } from "@/lib/path";
import { MenuItem } from "@/types/quizType";

// メニュー項目を取得するメイン関数
export const getMenuItems = async (currentUrl: string): Promise<MenuItem[]> => {
  const menuItems: MenuItem[] = [
    {
      name: "ホーム",
      href: path().$url().path,
    },
  ];

  const session = await auth();
  if (session && session.user.role === "admin") {
    // 管理者 修正資格のメニュー項目を追加
    const adminQuestiosItems = await getAdminQualificationItems();
    menuItems.push({
      name: "管理者-資格",
      children: adminQuestiosItems,
    });

    // 管理者 現在修正している問題のメニュー項目を追加
    const currentAdminQuestionItems =
      await getAdminCurrentQuestionItems(currentUrl);
    if (currentAdminQuestionItems.length > 0) {
      menuItems.push({
        name: "管理者-修正中の問題一覧",
        children: currentAdminQuestionItems,
      });
    }

    // 管理者 ファイルアップロードのメニュー項目を追加
    const fileMenuItems = getAdminFileMenuItems();
    menuItems.push({
      name: "管理者-ファイル",
      children: fileMenuItems,
    });
  }

  // 資格のメニュー項目を追加
  const questiosItems = await getQualificationItems();
  menuItems.push({
    name: "資格",
    children: questiosItems,
  });

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
