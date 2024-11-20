import { withPermissionAll } from "@/features/permission/lib/withPermissionAll";

describe("withPermissionAll", () => {
  it("should execute the operation if all permission checks pass", async () => {
    const mockOperation = jest.fn().mockResolvedValue(undefined);
    const mockPermissionChecks = [
      jest.fn().mockResolvedValue(true),
      jest.fn().mockResolvedValue(true),
    ];

    await withPermissionAll(mockOperation, mockPermissionChecks);

    expect(mockOperation).toHaveBeenCalledTimes(1);
    mockPermissionChecks.forEach((check) => {
      expect(check).toHaveBeenCalledTimes(1);
    });
  });

  it("should throw an error if any permission check fails", async () => {
    const mockOperation = jest.fn().mockResolvedValue(undefined);
    const mockPermissionChecks = [
      jest.fn().mockResolvedValue(true),
      jest.fn().mockResolvedValue(false),
    ];

    await expect(
      withPermissionAll(mockOperation, mockPermissionChecks),
    ).rejects.toThrow("Permission Denied");

    expect(mockOperation).not.toHaveBeenCalled();
    mockPermissionChecks.forEach((check) => {
      expect(check).toHaveBeenCalledTimes(1);
    });
  });

  it("should not execute the operation if no permission checks are provided", async () => {
    const mockOperation = jest.fn().mockResolvedValue(undefined);

    await expect(withPermissionAll(mockOperation, [])).rejects.toThrow(
      "Permission Denied",
    );

    expect(mockOperation).not.toHaveBeenCalled();
  });
});
