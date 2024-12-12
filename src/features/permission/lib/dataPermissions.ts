import {
  DataPermissionKind,
  dataPermissions,
} from "@/features/permission/dataPermissionsConfig";

/**
 * Checks if the provided permission kinds allow searching data.
 * @param permissionKinds - List of permissions the user has.
 * @returns True if the user can search data.
 */
export const canSearchData = (
  permissionKinds: DataPermissionKind[],
): boolean => {
  return permissionKinds.some((kind) =>
    dataPermissions.searchable.includes(kind),
  );
};

/**
 * Checks if the provided permission kinds allow adding data.
 * @param permissionKinds - List of permissions the user has.
 * @returns True if the user can add data.
 */
export const canAddData = (permissionKinds: DataPermissionKind[]): boolean => {
  return permissionKinds.some((kind) => dataPermissions.addable.includes(kind));
};

/**
 * Checks if the provided permission kinds allow editing data.
 * @param permissionKinds - List of permissions the user has.
 * @returns True if the user can edit data.
 */
export const canEditData = (permissionKinds: DataPermissionKind[]): boolean => {
  return permissionKinds.some((kind) =>
    dataPermissions.editable.includes(kind),
  );
};

/**
 * Checks if the provided permission kinds allow deleting data.
 * @param permissionKinds - List of permissions the user has.
 * @returns True if the user can delete data.
 */
export const canDeleteData = (
  permissionKinds: DataPermissionKind[],
): boolean => {
  return permissionKinds.some((kind) =>
    dataPermissions.deletable.includes(kind),
  );
};
