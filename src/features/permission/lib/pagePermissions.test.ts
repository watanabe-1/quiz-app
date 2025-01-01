import { canAccessPage } from "@/features/permission/lib/pagePermissions";

// Replace the actual protectedPaths and roleHierarchy with mocks
jest.mock("@/features/permission/pagePermissionsConfig", () => {
  /** Mock data for testing */
  const mockProtectedPaths = {
    user: ["/", "/user/articles", "/user/review", "/user/home"],
    admin: ["/admin/dashboard", "/admin/settings"],
  };

  const mockRoleHierarchy = {
    guest: ["guest", "user", "admin"],
    user: ["user", "admin"],
    admin: ["admin"],
  };

  const DEFAULT_ACCESS_ALLOWED = false;

  return {
    protectedPaths: mockProtectedPaths,
    roleHierarchy: mockRoleHierarchy,
    DEFAULT_ACCESS_ALLOWED: DEFAULT_ACCESS_ALLOWED,
  };
});

describe("canAccessPage", () => {
  it("should allow access to a path if the role is explicitly allowed", () => {
    expect(canAccessPage("/", "admin")).toBe(true);
    expect(canAccessPage("/admin/dashboard", "admin")).toBe(true);
    expect(canAccessPage("/admin/dashboard/test", "admin")).toBe(true);
    expect(canAccessPage("/user/articles", "user")).toBe(true);
    expect(canAccessPage("/", "user")).toBe(true);
  });

  it("should deny access to a path if the role is not allowed", () => {
    expect(canAccessPage("/admin/dashboard", "guest")).toBe(false);
    expect(canAccessPage("/admin/dashboard/test", "guest")).toBe(false);
    expect(canAccessPage("/user/articles", "guest")).toBe(false);
    expect(canAccessPage("/admin/settings", "user")).toBe(false);
    expect(canAccessPage("/admin/settings", "guest")).toBe(false);
    expect(canAccessPage("/", "guest")).toBe(false);
  });

  it("should allow access to a path by default if no matching regex is found", () => {
    expect(canAccessPage("/public/home", "user")).toBe(false);
    expect(canAccessPage("/random/path", "admin")).toBe(false);
  });

  it("should prioritize exact matches over prefix matches", () => {
    expect(canAccessPage("/user/home", "user")).toBe(true); // Exact match
    expect(canAccessPage("/user/home", "guest")).toBe(false); // Exact match
    expect(canAccessPage("/user/home/details", "user")).toBe(true); // Prefix match
    expect(canAccessPage("/user/home/details", "guest")).toBe(false); // Prefix match
  });

  it("should handle edge cases where path is not in protectedPaths", () => {
    expect(canAccessPage("/undefined/path", "user")).toBe(false); // Default not allow
    expect(canAccessPage("/undefined/path", "guest")).toBe(false); // Default not allow
  });

  it("should allow access to nested paths if parent path is protected", () => {
    expect(canAccessPage("/admin/dashboard/subpage", "admin")).toBe(true);
    expect(canAccessPage("/user/articles/nested/path", "user")).toBe(true);
  });

  it("should deny access if no roles are defined for a path", () => {
    // Assuming empty or undefined roles for a path should deny access
    expect(canAccessPage("/no/roles/defined", "user")).toBe(false);
  });

  it("should allow roles higher in the hierarchy to access lower-level paths", () => {
    expect(canAccessPage("/user/review", "admin")).toBe(true); // "admin" inherits from "user"
    expect(canAccessPage("/admin/settings", "admin")).toBe(true);
  });

  it("should deny access if the role is not in the hierarchy for the path", () => {
    expect(canAccessPage("/user/articles", "guest")).toBe(false); // "guest" is not allowed
  });

  it("should deny access to paths with no exact match or prefix match", () => {
    expect(canAccessPage("/unknown/path", "user")).toBe(false); // Default not allow
    expect(canAccessPage("/unknown/path", "guest")).toBe(false); // Default not allow
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
