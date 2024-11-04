/**
 * Checks if an object is empty.
 *
 * @param obj - The object to check for emptiness.
 * @returns `true` if the object has no own properties and is a plain object, otherwise `false`.
 *
 * @example
 * ```typescript
 * isEmptyObject({}); // returns true
 * isEmptyObject({ key: "value" }); // returns false
 * ```
 */
export const isEmptyObject = (obj: object): boolean => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};
