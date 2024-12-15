import { withPermissionAll } from "@/features/permission/lib/withPermissionAll";
import { PermissionCheck } from "@/features/permission/types/permission";
import { createServiceFunction } from "@/lib/createServiceFunction";

jest.mock("@/features/permission/lib/withPermissionAll", () => ({
  withPermissionAll: jest.fn(),
}));

describe("createServiceFunction", () => {
  it("should call the callback if all permissions pass", async () => {
    const mockCallback = jest.fn(async (x: number, y: number) => x + y);
    const permissions: PermissionCheck[] = [async () => true, async () => true];

    (withPermissionAll as jest.Mock).mockImplementation(async (callback) =>
      callback(),
    );

    const serviceFunction = createServiceFunction(mockCallback, permissions);
    const result = await serviceFunction(2, 3);

    expect(withPermissionAll).toHaveBeenCalledWith(
      expect.any(Function),
      permissions,
    );
    expect(mockCallback).toHaveBeenCalledWith(2, 3);
    expect(result).toBe(5);
  });

  it("should not call the callback if any permission fails", () => {
    const mockCallback = jest.fn(async (x: number, y: number) => x + y);
    const permissions: PermissionCheck[] = [
      async () => true,
      async () => false,
    ];

    (withPermissionAll as jest.Mock).mockImplementation(() => {
      throw new Error("Permission denied");
    });

    const serviceFunction = createServiceFunction(mockCallback, permissions);

    expect(() => serviceFunction(2, 3)).toThrow("Permission denied");
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it("should pass arguments correctly to the callback", async () => {
    const mockCallback = jest.fn(async (x: string, y: string) => `${x} ${y}`);
    const permissions: PermissionCheck[] = [async () => true];

    (withPermissionAll as jest.Mock).mockImplementation(async (callback) =>
      callback(),
    );

    const serviceFunction = createServiceFunction(mockCallback, permissions);
    const result = await serviceFunction("Hello", "World");

    expect(mockCallback).toHaveBeenCalledWith("Hello", "World");
    expect(result).toBe("Hello World");
  });
});
