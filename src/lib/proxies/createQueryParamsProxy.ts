/**
 * Creates a proxy for URLSearchParams to enable dynamic property access.
 * The proxy allows accessing URL query parameters as properties of an object.
 *
 * @typeParam T - A generic type representing an object where keys are strings, and values are optional strings.
 * @param {URLSearchParams} searchParams - The URLSearchParams instance used to access query parameters.
 * @returns {T} A proxy object that allows dynamic access to query parameters by property names.
 *
 * @example
 * const searchParams = new URLSearchParams("param1=value1&param2=value2");
 * const params = createQueryParamsProxy<{ param1: string | undefined, param2: string | undefined }>(searchParams);
 * console.log(params.param1); // Outputs: "value1"
 */
export const createQueryParamsProxy = <T extends Record<string, string>>(
  searchParams: URLSearchParams,
): T => {
  return new Proxy({} as T, {
    get: (_, prop: string) => {
      // Returns the value for the given prop, or undefined if not present
      return decodeURIComponent(searchParams.get(prop) ?? "");
    },
  });
};
