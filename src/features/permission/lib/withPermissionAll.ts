/**
 * Executes an operation if all provided permission checks pass.
 *
 * @param operation - A function representing the operation to execute. It should return a Promise of type T.
 * @param permissionChecks - An array of functions, each returning a Promise that resolves to a boolean indicating whether the permission is granted.
 * @throws Will throw an error with the message "Permission Denied" if any of the permission checks fail.
 * @example
 * ```typescript
 * const operation = async () => {
 *   console.log("Operation executed");
 *   return "Success";
 * };
 * const checks = [
 *   async () => true,
 *   async () => true,
 * ];
 * const result = await withPermissionAll(operation, checks); // Will execute operation and return "Success"
 * console.log(result); // Outputs: Success
 * ```
 */
export const withPermissionAll = async <T>(
  operation: () => Promise<T>,
  permissionChecks: Array<() => Promise<boolean>>,
  hasNotPermission?: () => Promise<T>,
): Promise<T> => {
  if (permissionChecks.length === 0) {
    throw new Error("Permission Denied");
  }

  const results = await Promise.all(permissionChecks.map((check) => check()));
  const hasPermission = results.every((result) => result);

  if (!hasPermission) {
    if (hasNotPermission) {
      return await hasNotPermission();
    } else {
      throw new Error("Permission Denied");
    }
  }

  return await operation();
};
