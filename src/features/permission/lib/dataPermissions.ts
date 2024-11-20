import {
  PermissionKind,
  dataPermissions,
} from "@/features/permission/permissionsConfig";

/**
 * Checks if the provided permission kinds allow searching data.
 * @param {PermissionKind[]} permissionKinds - List of permissions the user has.
 * @returns {boolean} True if the user can search data.
 */
export const canSearchData = (permissionKinds: PermissionKind[]): boolean => {
  return permissionKinds.some((kind) =>
    dataPermissions.searchable.includes(kind),
  );
};

/**
 * Checks if the provided permission kinds allow adding data.
 * @param {PermissionKind[]} permissionKinds - List of permissions the user has.
 * @returns {boolean} True if the user can add data.
 */
export const canAddData = (permissionKinds: PermissionKind[]): boolean => {
  return permissionKinds.some((kind) => dataPermissions.addable.includes(kind));
};

/**
 * Checks if the provided permission kinds allow editing data.
 * @param {PermissionKind[]} permissionKinds - List of permissions the user has.
 * @returns {boolean} True if the user can edit data.
 */
export const canEditData = (permissionKinds: PermissionKind[]): boolean => {
  return permissionKinds.some((kind) =>
    dataPermissions.editable.includes(kind),
  );
};

/**
 * Checks if the provided permission kinds allow deleting data.
 * @param {PermissionKind[]} permissionKinds - List of permissions the user has.
 * @returns {boolean} True if the user can delete data.
 */
export const canDeleteData = (permissionKinds: PermissionKind[]): boolean => {
  return permissionKinds.some((kind) =>
    dataPermissions.deletable.includes(kind),
  );
};
