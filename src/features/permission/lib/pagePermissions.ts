import {
  DEFAULT_ACCESS_ALLOWED,
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
  }, [])
  .sort((a, b) => b.path.length - a.path.length);

/**
 * Converts an array of page permissions to a Map for faster lookups
 *
 * @example
 * Input:
 * ```ts
 * [
 *   { path: '/admin', allowedRoles: ['admin'] },
 *   { path: '/user', allowedRoles: ['user', 'admin'] }
 * ]
 * ```
 * Output:
 * ```ts
 * Map {
 *   '/admin' => ['admin'],
 *   '/user' => ['user', 'admin']
 * }
 * ```
 *
 * @returns A `Map` where the key is the path and the value is the array of roles.
 */
const permissionMap = new Map<string, Role[]>(
  pagePermissions.map((permission) => [
    permission.path,
    permission.allowedRoles,
  ]),
);

/**
 * Checks if a given role is allowed to access a specific path based on permissions.
 * If no matching path is found, the path is accessible to everyone by default.
 *
 * @param path - The target path to check.
 * @param role - The role attempting to access the path.
 * @returns `true` if the role is allowed, otherwise `false`.
 */
export const canAccessPage = (path: string, role: Role): boolean => {
  for (const [basePath, allowedRoles] of permissionMap) {
    if (path === basePath || path.startsWith(`${basePath}/`)) {
      return allowedRoles.includes(role);
    }
  }

  return DEFAULT_ACCESS_ALLOWED;
};
