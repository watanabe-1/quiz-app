import { getRole } from "@/features/auth/lib/getRole";
import {
  roleDataPermissions,
  DataPermissionKind,
} from "@/features/permission/dataPermissionsConfig";
import {
  canSearchData,
  canAddData,
  canEditData,
  canDeleteData,
} from "@/features/permission/lib/dataPermissions";
import { canAccessPage } from "@/features/permission/lib/pagePermissions";
import {
  getDataPermissionKinds,
  permission,
} from "@/features/permission/lib/permission";

// モックの設定
jest.mock("@/features/auth/lib/getRole");
jest.mock("@/features/permission/lib/dataPermissions");
jest.mock("@/features/permission/lib/pagePermissions");

// モックデータと関数
const mockGetRole = getRole as jest.Mock;
const mockCanSearchData = canSearchData as jest.Mock;
const mockCanAddData = canAddData as jest.Mock;
const mockCanEditData = canEditData as jest.Mock;
const mockCanDeleteData = canDeleteData as jest.Mock;
const mockIsRoleAllowedForPathWithMap = canAccessPage as jest.Mock;

describe("permission service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getDataPermissionKinds", () => {
    it("should return the permissions for the admin role", async () => {
      mockGetRole.mockResolvedValue("admin");
      const expectedPermissions: DataPermissionKind[] = [
        "viewer",
        "editor",
        "admin",
      ];

      const permissions = await getDataPermissionKinds();
      expect(permissions).toEqual(expectedPermissions);
      expect(mockGetRole).toHaveBeenCalled();
    });

    it("should return the permissions for the guest role", async () => {
      mockGetRole.mockResolvedValue("guest");
      const expectedPermissions: DataPermissionKind[] = ["viewer"];

      const permissions = await getDataPermissionKinds();
      expect(permissions).toEqual(expectedPermissions);
    });
  });

  describe("permission.data.search", () => {
    it("should return true if the user has search permission", async () => {
      mockCanSearchData.mockImplementation(
        (permissions: DataPermissionKind[]) => permissions.includes("viewer"),
      );
      mockGetRole.mockResolvedValue("user");
      roleDataPermissions.user = ["viewer"];

      const result = await permission.data.search();
      expect(result).toBe(true);
    });

    it("should return false if the user does not have search permission", async () => {
      mockCanSearchData.mockImplementation(
        (permissions: DataPermissionKind[]) => permissions.includes("admin"),
      );
      mockGetRole.mockResolvedValue("guest");
      roleDataPermissions.guest = ["viewer"];

      const result = await permission.data.search();
      expect(result).toBe(false);
    });
  });

  describe("permission.data.add", () => {
    it("should return true if the user has add permission", async () => {
      mockCanAddData.mockImplementation((permissions: DataPermissionKind[]) =>
        permissions.includes("editor"),
      );
      mockGetRole.mockResolvedValue("admin");
      roleDataPermissions.admin = ["viewer", "editor", "admin"];

      const result = await permission.data.add();
      expect(result).toBe(true);
    });

    it("should return false if the user does not have add permission", async () => {
      mockCanAddData.mockImplementation((permissions: DataPermissionKind[]) =>
        permissions.includes("editor"),
      );
      mockGetRole.mockResolvedValue("guest");
      roleDataPermissions.guest = ["viewer"];

      const result = await permission.data.add();
      expect(result).toBe(false);
    });
  });

  describe("permission.data.edit", () => {
    it("should return true if the user has edit permission", async () => {
      mockCanEditData.mockImplementation((permissions: DataPermissionKind[]) =>
        permissions.includes("editor"),
      );
      mockGetRole.mockResolvedValue("admin");
      roleDataPermissions.admin = ["viewer", "editor", "admin"];

      const result = await permission.data.edit();
      expect(result).toBe(true);
    });

    it("should return false if the user does not have edit permission", async () => {
      mockCanEditData.mockImplementation((permissions: DataPermissionKind[]) =>
        permissions.includes("editor"),
      );
      mockGetRole.mockResolvedValue("guest");
      roleDataPermissions.guest = ["viewer"];

      const result = await permission.data.edit();
      expect(result).toBe(false);
    });
  });

  describe("permission.data.delete", () => {
    it("should return true if the user has delete permission", async () => {
      mockCanDeleteData.mockImplementation(
        (permissions: DataPermissionKind[]) => permissions.includes("admin"),
      );
      mockGetRole.mockResolvedValue("admin");
      roleDataPermissions.admin = ["viewer", "editor", "admin"];

      const result = await permission.data.delete();
      expect(result).toBe(true);
    });

    it("should return false if the user does not have delete permission", async () => {
      mockCanDeleteData.mockImplementation(
        (permissions: DataPermissionKind[]) => permissions.includes("admin"),
      );
      mockGetRole.mockResolvedValue("guest");
      roleDataPermissions.guest = ["viewer"];

      const result = await permission.data.delete();
      expect(result).toBe(false);
    });
  });

  describe("permission.page.access", () => {
    it("should return true if the user has access to the current page", async () => {
      // モック設定
      mockGetRole.mockResolvedValue("admin");

      mockIsRoleAllowedForPathWithMap.mockImplementation((path, role) => {
        return path === "/admin" && role === "admin";
      });

      const result = await permission.page.access("/admin");

      // 結果検証
      expect(result).toBe(true);
      expect(mockIsRoleAllowedForPathWithMap).toHaveBeenCalledWith(
        "/admin",
        "admin",
      );
    });

    it("should return false if the user does not have access to the current page", async () => {
      mockGetRole.mockResolvedValue("user");

      mockIsRoleAllowedForPathWithMap.mockImplementation((path, role) => {
        return path !== "/restricted" || role !== "user";
      });

      const result = await permission.page.access("/restricted");

      expect(result).toBe(false);
      expect(mockIsRoleAllowedForPathWithMap).toHaveBeenCalledWith(
        "/restricted",
        "user",
      );
    });
  });
});
