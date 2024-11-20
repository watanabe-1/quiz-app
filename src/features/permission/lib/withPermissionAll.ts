/**
 * Executes an operation if all provided permission checks pass.
 *
 * @param operation - A function representing the operation to execute. It should return a Promise.
 * @param permissionChecks - An array of functions, each returning a Promise that resolves to a boolean indicating whether the permission is granted.
 * @throws Will throw an error with the message "Permission Denied" if any of the permission checks fail.
 * @example
 * ```typescript
 * const operation = async () => {
 *   console.log("Operation executed");
 * };
 * const checks = [
 *   async () => true,
 *   async () => true,
 * ];
 * await withPermissionAll(operation, checks); // Will execute operation
 * ```
 */
export const withPermissionAll = async (
  operation: () => Promise<void>,
  permissionChecks: Array<() => Promise<boolean>>,
) => {
  if (permissionChecks.length === 0) {
    throw new Error("Permission Denied");
  }

  const results = await Promise.all(permissionChecks.map((check) => check()));
  const hasPermission = results.every((result) => result);

  if (!hasPermission) {
    throw new Error("Permission Denied");
  }

  await operation();
};
