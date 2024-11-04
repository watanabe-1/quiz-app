import { CustomizableLocalStorage } from "@/@types/quizType";

/**
 * Creates a proxy object for managing localStorage items.
 * The proxy supports dynamic retrieval and setting of values stored in localStorage.
 *
 * @returns {CustomizableLocalStorage} A proxy object that allows flexible access and modification of localStorage items.
 *
 * @example
 * ```typescript
 * const localStorageProxy = createLocalStorageProxy();
 *
 * // Retrieve an existing item
 * const userToken = localStorageProxy['user-token'];
 * console.log('User Token:', userToken);
 *
 * // Set a new item
 * localStorageProxy['user-token'] = 'my-secret-token';
 * console.log('User Token:', localStorageProxy['user-token']);
 *
 * // Remove an item by setting it to undefined
 * localStorageProxy['user-token'] = undefined;
 * ```
 */
export const createLocalStorageProxy = (): CustomizableLocalStorage => {
  return new Proxy({} as CustomizableLocalStorage, {
    /**
     * Retrieves the value for a given property from localStorage.
     *
     * @param _ - Unused target object reference.
     * @param prop - The key in localStorage to retrieve.
     * @returns The value of the requested item, or `undefined` if not present.
     */
    get: (_, prop: string) => {
      return localStorage.getItem(prop) ?? undefined;
    },

    /**
     * Sets the value for a given property in localStorage.
     * If the value is `undefined`, the item is removed from localStorage.
     *
     * @param _ - Unused target object reference.
     * @param prop - The key in localStorage to set.
     * @param value - The value to assign to the item in localStorage.
     * @returns A boolean indicating the success of the set operation (`true`).
     */
    set: (_, prop: string, value: string | undefined) => {
      if (value === undefined) {
        localStorage.removeItem(prop);
      } else {
        localStorage.setItem(prop, value);
      }
      return true;
    },
  });
};
