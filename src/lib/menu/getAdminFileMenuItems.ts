import {
  path_admin_export,
  path_admin_upload_businessCareer,
} from "@/lib/path";
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
    href: path_admin_upload_businessCareer().$url().path,
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
    href: path_admin_export().$url().path,
  };

  const exportMenuItems: MenuItem = {
    name: "エクスポート",
    children: [exportQualificationMenuItem],
  };

  return exportMenuItems;
};
