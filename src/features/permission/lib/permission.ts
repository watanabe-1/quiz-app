import { getRole } from "@/features/auth/lib/getRole";
import {
  canSearchData,
  canAddData,
  canEditData,
  canDeleteData,
} from "@/features/permission/lib/dataPermissions";
import {
  PermissionKind,
  rolePermissions,
} from "@/features/permission/permissionsConfig";

/**
 * Fetches the permission kinds for the current user based on their role.
 * @returns {Promise<PermissionKind[]>} A promise that resolves to the user's permissions.
 */
export const getPermissionKinds = async (): Promise<PermissionKind[]> => {
  const role = await getRole();
  const permissions = rolePermissions[role];
  return permissions;
};

/**
 * Executes a given callback function with the user's permissions.
 * @param {(permissionKind: PermissionKind[]) => boolean} func - A callback to evaluate permissions.
 * @returns {Promise<boolean>} A promise that resolves to the result of the callback.
 */
const dataCallBacker = async (
  func: (permissionKind: PermissionKind[]) => boolean,
): Promise<boolean> => {
  const permissionKinds = await getPermissionKinds();
  return func(permissionKinds);
};

/**
 * Permission service for data operations.
 */
export const permission = {
  data: {
    /**
     * Checks if the user can search data.
     * @returns {Promise<boolean>} True if the user can search data.
     */
    search: () => dataCallBacker(canSearchData),

    /**
     * Checks if the user can add data.
     * @returns {Promise<boolean>} True if the user can add data.
     */
    add: () => dataCallBacker(canAddData),

    /**
     * Checks if the user can edit data.
     * @returns {Promise<boolean>} True if the user can edit data.
     */
    edit: () => dataCallBacker(canEditData),

    /**
     * Checks if the user can delete data.
     * @returns {Promise<boolean>} True if the user can delete data.
     */
    delete: () => dataCallBacker(canDeleteData),
  },
};
