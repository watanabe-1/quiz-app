import { withPermissionAll } from "@/features/permission/lib/withPermissionAll";
import { PermissionCheck } from "@/features/permission/types/permission";

/**
 * Wraps a given service function with a permission check.
 *
 * This function ensures that the callback function is executed only if
 * all the provided permissions pass the check.
 *
 * @template T - The type of the callback function.
 * @param callback - The service function to wrap with permission checks.
 * @param permissions - An array of permission checks to validate before executing the callback.
 * @returns A new function that performs permission checks before invoking the original callback.
 *
 * @example
 * ```typescript
 * const callback = async (x: number, y: number) => x + y;
 * const permissions: PermissionCheck[] = [
 *   () => true,
 *   () => false
 * ];
 * const serviceFunction = createServiceFunction(callback, permissions);
 * // serviceFunction will not execute if any permission fails.
 * ```
 */
export function createServiceFunction<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends (...args: any[]) => Promise<any>,
>(callback: T, permissions: PermissionCheck[]): T {
  return ((...args: Parameters<T>) => {
    return withPermissionAll(async () => callback(...args), permissions);
  }) as T;
}
