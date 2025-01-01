import {
  protectedPaths,
  roleHierarchy,
} from "@/features/permission/pagePermissionsConfig";
import { Role } from "@/types/next-auth";

/**
 * Represents a mapping of a path to the roles allowed to access it.
 */
type PagePermission = {
  /**
   * The path for which permissions are defined.
   */
  path: string;

  /**
   * The list of roles allowed to access the path.
   */
  allowedRoles: Role[];
};

/**
 * Generates an array of page permissions by combining `protectedPaths` and `roleHierarchy`.
 * Ensures unique roles are combined for paths shared among multiple roles.
 */
const pagePermissions: PagePermission[] = Object.entries(protectedPaths)
  .flatMap(([role, paths]) =>
    paths.map((path) => ({
      path,
      allowedRoles: roleHierarchy[role as Role],
    })),
  )
  .reduce<PagePermission[]>((acc, { path, allowedRoles }) => {
    const existingPermission = acc.find(
      (permission) => permission.path === path,
    );
    if (existingPermission) {
      // Merge roles for the same path
      existingPermission.allowedRoles = Array.from(
        new Set([...existingPermission.allowedRoles, ...allowedRoles]),
      );
    } else {
      // Add new path permission
      acc.push({ path, allowedRoles });
    }

    return acc;
  }, []);

/**
 * Checks if a given role is allowed to access a specific path based on permissions.
 * If no matching path is found, the path is accessible to everyone by default.
 *
 * @param path - The target path to check.
 * @param role - The role attempting to access the path.
 * @returns `true` if the role is allowed, otherwise `false`.
 */
export const canAccessPage = (path: string, role: Role): boolean => {
  // Check if the path starts with any defined path and if the role is allowed
  const match = pagePermissions.find((permission) => {
    const basePath = permission.path;

    return path === basePath || path.startsWith(`${basePath}/`);
  });

  // If a match is found, check if the role is included in the allowed roles
  if (match) {
    return match.allowedRoles.includes(role);
  }

  // If no match is found, allow access by default
  return true;
};
