import { client } from "@/lib/client";
import { MenuItem } from "@/types/quizType";

// 管理者用ファイル関連メニュー
export const getAdminFileMenuItems = (): MenuItem[] => {
  const uploadMenuItem = getAdminFileUploadMenuItem();
  const exportMenuItem = getAdminFileExportMenuItem();

  return [uploadMenuItem, exportMenuItem];
};

export const getAdminFileUploadMenuItem = (): MenuItem => {
  const uploadBusinessCareerMenuItem: MenuItem = {
    name: "ビジネスキャリア",

    href: client.admin.upload.businessCareer.$url().path,
  };

  const uploadMenuItems: MenuItem = {
    name: "アップロード",
    children: [uploadBusinessCareerMenuItem],
  };

  return uploadMenuItems;
};

export const getAdminFileExportMenuItem = (): MenuItem => {
  const exportQualificationMenuItem: MenuItem = {
    name: "資格",
    href: client.admin.export.$url().path,
  };

  const exportMenuItems: MenuItem = {
    name: "エクスポート",
    children: [exportQualificationMenuItem],
  };

  return exportMenuItems;
};
