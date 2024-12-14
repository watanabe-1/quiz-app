import { getRole } from "@/features/auth/lib/getRole";
import {
  DataPermissionKind,
  roleDataPermissions,
} from "@/features/permission/dataPermissionsConfig";
import {
  canSearchData,
  canAddData,
  canEditData,
  canDeleteData,
} from "@/features/permission/lib/dataPermissions";
import { isRoleAllowedForPathWithMap } from "@/features/permission/lib/pagePermissions";
import { Role } from "@/types/next-auth";

/**
 * Fetches the permission kinds for the current user based on their role.
 * @returns A promise that resolves to the user's permissions.
 */
export const getDataPermissionKinds = async (): Promise<
  DataPermissionKind[]
> => {
  const role = await getRole();
  const permissions = roleDataPermissions[role];

  return permissions;
};

/**
 * Executes a given callback function with the user's permissions.
 * @param  func - A callback to evaluate permissions.
 * @returns A promise that resolves to the result of the callback.
 */
const dataCallBacker = async (
  func: (permissionKind: DataPermissionKind[]) => boolean,
): Promise<boolean> => {
  const permissionKinds = await getDataPermissionKinds();

  return func(permissionKinds);
};

/**
 * Executes a callback function with the page permission kinds and current path name.
 *
 * @param path - The target path to check.
 * @param func - A callback function that takes an array of page permission kinds and a path string.
 * @returns A promise that resolves to a boolean indicating the result of the callback function.
 */
const pageCallBacker = async (
  path: string,
  func: (path: string, role: Role) => boolean,
): Promise<boolean> => {
  const role = await getRole();

  return func(path, role);
};

/**
 * Permission service for data operations.
 */
export const permission = {
  data: {
    /**
     * Checks if the user can search data.
     * @returns True if the user can search data.
     */
    search: () => dataCallBacker(canSearchData),

    /**
     * Checks if the user can add data.
     * @returns True if the user can add data.
     */
    add: () => dataCallBacker(canAddData),

    /**
     * Checks if the user can edit data.
     * @returns True if the user can edit data.
     */
    edit: () => dataCallBacker(canEditData),

    /**
     * Checks if the user can delete data.
     * @returns True if the user can delete data.
     */
    delete: () => dataCallBacker(canDeleteData),
  },
  page: {
    /**
     * Checks if the user has access to the page.
     *
     * @returns A promise that resolves to true if the user can access the page, otherwise false.
     */
    access: (path: string) => pageCallBacker(path, isRoleAllowedForPathWithMap),
  },
};
