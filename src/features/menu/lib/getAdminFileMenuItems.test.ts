import {
  getAdminFileMenuItems,
  getAdminFileUploadMenuItem,
  getAdminFileExportMenuItem,
} from "@/features/menu/lib/getAdminFileMenuItems";

// モック関数を設定
jest.mock("@/lib/path", () => ({
  path_admin_export: jest.fn(() => ({
    $url: () => ({ path: "/admin/export" }),
  })),
  path_admin_upload_businessCareer: jest.fn(() => ({
    $url: () => ({ path: "/admin/upload/businessCareer" }),
  })),
}));

describe("getAdminFileMenuItem 関数のテスト", () => {
  test("管理者用ファイル関連メニューが正しく生成される", () => {
    const menuItems = getAdminFileMenuItems();

    expect(menuItems).toHaveLength(2);

    // アップロードメニューのテスト
    expect(menuItems[0]).toEqual({
      name: "アップロード",
      children: [
        {
          name: "ビジネスキャリア",
          href: "/admin/upload/businessCareer",
        },
      ],
    });

    // エクスポートメニューのテスト
    expect(menuItems[1]).toEqual({
      name: "エクスポート",
      children: [
        {
          name: "資格",
          href: "/admin/export",
        },
      ],
    });
  });
});

describe("getAdminFileUploadMenuItem 関数のテスト", () => {
  test("アップロードメニュー項目が正しく生成される", () => {
    const uploadMenuItem = getAdminFileUploadMenuItem();

    expect(uploadMenuItem).toEqual({
      name: "アップロード",
      children: [
        {
          name: "ビジネスキャリア",
          href: "/admin/upload/businessCareer",
        },
      ],
    });
  });
});

describe("getAdminFileExportMenuItem 関数のテスト", () => {
  test("エクスポートメニュー項目が正しく生成される", () => {
    const exportMenuItem = getAdminFileExportMenuItem();

    expect(exportMenuItem).toEqual({
      name: "エクスポート",
      children: [
        {
          name: "資格",
          href: "/admin/export",
        },
      ],
    });
  });
});
