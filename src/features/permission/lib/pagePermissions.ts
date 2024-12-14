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
 * Extends `PagePermission` to include a compiled regular expression for path matching.
 */
interface PathPermissionWithRegex extends PagePermission {
  /**
   * Regular expression generated from the path for efficient matching.
   */
  regex: RegExp;
}

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
 * Converts a path string to a regular expression for matching dynamic paths.
 *
 * This function trims any extra whitespace from the input path and converts it
 * into a regular expression. The resulting regular expression matches the given
 * path and any subpaths that start with it.
 *
 * @param path - The path string to convert. It should be a base path without
 * trailing slashes unless explicitly required.
 * @returns A `RegExp` object that matches the specified path and its subpaths.
 * For example, the path `/example` would match `/example` and `/example/subpath`.
 */
const toPageRegExp = (path: string): RegExp =>
  new RegExp(`^${path.trim()}(\\/.*)?$`);

/**
 * An array of `PathPermissionWithRegex` objects that includes regex for each path.
 */
const pagePermissionsWithRegex: PathPermissionWithRegex[] = pagePermissions.map(
  (permission) => ({
    ...permission,
    regex: toPageRegExp(permission.path),
  }),
);

/**
 * A map of regular expressions to allowed roles for efficient permission checking.
 */
const pagePermissionsMap: Map<RegExp, Role[]> = new Map(
  pagePermissionsWithRegex.map(({ regex, allowedRoles }) => [
    regex,
    allowedRoles,
  ]),
);

/**
 * Checks if a given role is allowed to access a specific path based on permissions.
 * If no matching regular expression is found, the path is accessible to everyone by default.
 *
 * @param path - The target path to check.
 * @param role - The role attempting to access the path.
 * @returns `true` if the role is allowed, otherwise `false`.
 */
export const canAccessPage = (path: string, role: Role): boolean => {
  // Iterate through the pagePermissionsMap to find a matching regex
  for (const [regex, roles] of pagePermissionsMap) {
    if (regex.test(path)) {
      // Return true if the role is included, false otherwise
      return roles.includes(role);
    }
  }

  // If no matching regex is found, allow access by default
  return true;
};
