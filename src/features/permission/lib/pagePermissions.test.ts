import { isRoleAllowedForPathWithMap } from "@/features/permission/lib/pagePermissions";

// Replace the actual protectedPaths and roleHierarchy with mocks
jest.mock("@/features/permission/pagePermissionsConfig", () => {
  /** Mock data for testing */
  const mockProtectedPaths = {
    user: ["/user/articles", "/user/review"],
    admin: ["/admin/dashboard", "/admin/settings"],
  };

  const mockRoleHierarchy = {
    guest: ["guest", "user", "admin"],
    user: ["user", "admin"],
    admin: ["admin"],
  };

  return {
    protectedPaths: mockProtectedPaths,
    roleHierarchy: mockRoleHierarchy,
  };
});

describe("isRoleAllowedForPathWithMap", () => {
  it("should allow access to a path if the role is explicitly allowed", () => {
    expect(isRoleAllowedForPathWithMap("/admin/dashboard", "admin")).toBe(true);
    expect(isRoleAllowedForPathWithMap("/admin/dashboard/test", "admin")).toBe(
      true,
    );
    expect(isRoleAllowedForPathWithMap("/user/articles", "user")).toBe(true);
  });

  it("should deny access to a path if the role is not allowed", () => {
    expect(isRoleAllowedForPathWithMap("/admin/dashboard", "guest")).toBe(
      false,
    );
    expect(isRoleAllowedForPathWithMap("/admin/dashboard/test", "guest")).toBe(
      false,
    );
    expect(isRoleAllowedForPathWithMap("/user/articles", "guest")).toBe(false);
  });

  it("should allow access to a path by default if no matching regex is found", () => {
    expect(isRoleAllowedForPathWithMap("/public/home", "user")).toBe(true);
    expect(isRoleAllowedForPathWithMap("/random/path", "admin")).toBe(true);
  });

  it("should generate correct pagePermissionsMap from protectedPaths and roleHierarchy", () => {
    const pagePermissionsMap = new Map([
      [/^\/admin\/dashboard$/, ["admin", "guest", "user"]],
      [/^\/admin\/settings$/, ["admin", "guest", "user"]],
      [/^\/guest\/articles$/, ["guest", "user"]],
      [/^\/guest\/review$/, ["guest", "user"]],
    ]);

    for (const [regex, roles] of pagePermissionsMap) {
      const expectedRoles = pagePermissionsMap.get(regex);
      expect(expectedRoles).toEqual(roles);
    }
  });
});
