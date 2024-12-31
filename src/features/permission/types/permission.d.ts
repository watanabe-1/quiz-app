/**
 * A function that represents an operation to execute.
 * The operation returns a Promise of type T upon completion.
 *
 * @template T - The return type of the operation.
 * @example
 * const operation: Operation<string> = async () => {
 *   return "Success";
 * };
 */
export type Operation<T> = () => Promise<T>;

/**
 * A function that checks a specific permission.
 * The function returns a Promise that resolves to a boolean
 * indicating whether the permission is granted.
 *
 * @example
 * const check: PermissionCheck = async () => true;
 */
export type PermissionCheck = () => Promise<boolean>;

/**
 * Represents a list of permission checks that contains at least one `PermissionCheck`.
 * This ensures that there is always at least one check in the array.
 *
 * Each `PermissionCheck` is a function that returns a Promise resolving to a boolean,
 * indicating whether a specific permission is granted.
 *
 * @example
 * const checks: NonEmptyPermissionCheckList = [
 *   async () => true,  // First permission check
 *   async () => false, // Second permission check
 * ];
 */
export type NonEmptyPermissionCheckList = PermissionCheck[] & {
  0: PermissionCheck;
};

/**
 * A fallback operation to execute if permissions are not granted.
 * The fallback operation returns a Promise of type T upon completion.
 *
 * @template T - The return type of the fallback operation.
 * @example
 * const fallback: FallbackOperation<string> = async () => {
 *   return "Permission denied, fallback executed";
 * };
 */
export type FallbackOperation<T> = () => Promise<T>;
