import { getRole } from "@/features/auth/lib/getRole";
import {
  canSearchData,
  canAddData,
  canEditData,
  canDeleteData,
} from "@/features/permission/lib/dataPermissions";
import {
  getPermissionKinds,
  permission,
} from "@/features/permission/lib/permission";
import {
  rolePermissions,
  PermissionKind,
} from "@/features/permission/permissionsConfig";

// モックの設定
jest.mock("@/features/auth/lib/getRole");
jest.mock("@/features/permission/lib/dataPermissions");

const mockGetRole = getRole as jest.Mock;
const mockCanSearchData = canSearchData as jest.Mock;
const mockCanAddData = canAddData as jest.Mock;
const mockCanEditData = canEditData as jest.Mock;
const mockCanDeleteData = canDeleteData as jest.Mock;

describe("permission service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getPermissionKinds", () => {
    it("should return the permissions for the admin role", async () => {
      mockGetRole.mockResolvedValue("admin");
      const expectedPermissions: PermissionKind[] = [
        "viewer",
        "editor",
        "admin",
      ];

      const permissions = await getPermissionKinds();
      expect(permissions).toEqual(expectedPermissions);
      expect(mockGetRole).toHaveBeenCalled();
    });

    it("should return the permissions for the guest role", async () => {
      mockGetRole.mockResolvedValue("guest");
      const expectedPermissions: PermissionKind[] = ["viewer"];

      const permissions = await getPermissionKinds();
      expect(permissions).toEqual(expectedPermissions);
    });
  });

  describe("permission.data.search", () => {
    it("should return true if the user has search permission", async () => {
      mockCanSearchData.mockImplementation((permissions: PermissionKind[]) =>
        permissions.includes("viewer"),
      );
      mockGetRole.mockResolvedValue("user");
      rolePermissions.user = ["viewer"];

      const result = await permission.data.search();
      expect(result).toBe(true);
    });

    it("should return false if the user does not have search permission", async () => {
      mockCanSearchData.mockImplementation((permissions: PermissionKind[]) =>
        permissions.includes("admin"),
      );
      mockGetRole.mockResolvedValue("guest");
      rolePermissions.guest = ["viewer"];

      const result = await permission.data.search();
      expect(result).toBe(false);
    });
  });

  describe("permission.data.add", () => {
    it("should return true if the user has add permission", async () => {
      mockCanAddData.mockImplementation((permissions: PermissionKind[]) =>
        permissions.includes("editor"),
      );
      mockGetRole.mockResolvedValue("admin");
      rolePermissions.admin = ["viewer", "editor", "admin"];

      const result = await permission.data.add();
      expect(result).toBe(true);
    });

    it("should return false if the user does not have add permission", async () => {
      mockCanAddData.mockImplementation((permissions: PermissionKind[]) =>
        permissions.includes("editor"),
      );
      mockGetRole.mockResolvedValue("guest");
      rolePermissions.guest = ["viewer"];

      const result = await permission.data.add();
      expect(result).toBe(false);
    });
  });

  describe("permission.data.edit", () => {
    it("should return true if the user has edit permission", async () => {
      mockCanEditData.mockImplementation((permissions: PermissionKind[]) =>
        permissions.includes("editor"),
      );
      mockGetRole.mockResolvedValue("admin");
      rolePermissions.admin = ["viewer", "editor", "admin"];

      const result = await permission.data.edit();
      expect(result).toBe(true);
    });

    it("should return false if the user does not have edit permission", async () => {
      mockCanEditData.mockImplementation((permissions: PermissionKind[]) =>
        permissions.includes("editor"),
      );
      mockGetRole.mockResolvedValue("guest");
      rolePermissions.guest = ["viewer"];

      const result = await permission.data.edit();
      expect(result).toBe(false);
    });
  });

  describe("permission.data.delete", () => {
    it("should return true if the user has delete permission", async () => {
      mockCanDeleteData.mockImplementation((permissions: PermissionKind[]) =>
        permissions.includes("admin"),
      );
      mockGetRole.mockResolvedValue("admin");
      rolePermissions.admin = ["viewer", "editor", "admin"];

      const result = await permission.data.delete();
      expect(result).toBe(true);
    });

    it("should return false if the user does not have delete permission", async () => {
      mockCanDeleteData.mockImplementation((permissions: PermissionKind[]) =>
        permissions.includes("admin"),
      );
      mockGetRole.mockResolvedValue("guest");
      rolePermissions.guest = ["viewer"];

      const result = await permission.data.delete();
      expect(result).toBe(false);
    });
  });
});
