import {
  canSearchData,
  canAddData,
  canEditData,
  canDeleteData,
} from "@/features/permission/lib/dataPermissions";

jest.mock("@/features/permission/dataPermissionsConfig", () => {
  const mockDataPermissions = {
    searchable: ["viewer", "admin"],
    addable: ["editor", "admin"],
    editable: ["editor", "admin"],
    deletable: ["admin"],
  };

  return {
    dataPermissions: mockDataPermissions,
  };
});

describe("Permission utilities", () => {
  describe("canSearchData", () => {
    it("should return true if permission kind includes a searchable permission", () => {
      expect(canSearchData(["viewer"])).toBe(true);
      expect(canSearchData(["admin"])).toBe(true);
    });

    it("should return false if permission kind does not include a searchable permission", () => {
      expect(canSearchData(["editor"])).toBe(false);
      expect(canSearchData([])).toBe(false);
    });
  });

  describe("canAddData", () => {
    it("should return true if permission kind includes an addable permission", () => {
      expect(canAddData(["editor"])).toBe(true);
      expect(canAddData(["admin"])).toBe(true);
    });

    it("should return false if permission kind does not include an addable permission", () => {
      expect(canAddData(["viewer"])).toBe(false);
      expect(canAddData([])).toBe(false);
    });
  });

  describe("canEditData", () => {
    it("should return true if permission kind includes an editable permission", () => {
      expect(canEditData(["editor"])).toBe(true);
      expect(canEditData(["admin"])).toBe(true);
    });

    it("should return false if permission kind does not include an editable permission", () => {
      expect(canEditData(["viewer"])).toBe(false);
      expect(canEditData([])).toBe(false);
    });
  });

  describe("canDeleteData", () => {
    it("should return true if permission kind includes a deletable permission", () => {
      expect(canDeleteData(["admin"])).toBe(true);
    });

    it("should return false if permission kind does not include a deletable permission", () => {
      expect(canDeleteData(["viewer"])).toBe(false);
      expect(canDeleteData(["editor"])).toBe(false);
      expect(canDeleteData([])).toBe(false);
    });
  });
});
