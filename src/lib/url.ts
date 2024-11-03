import { getHost } from "@/lib/headers";

/**
 * Creates a base URL string based on the protocol and host.
 * If `NEXT_PUBLIC_PROTOCOL` is specified in environment variables, it is used as the protocol;
 * otherwise, "https" is used by default. The host is retrieved using `getHost()`.
 *
 * @returns {string} The full base URL (e.g., "https://example.com").
 * @throws Will throw an error if the host is not defined.
 */
const createBaseUrl = (): string => {
  const host = getHost();
  if (!host) {
    throw new Error("Host is not defined");
  }

  const protocol = process.env.NEXT_PUBLIC_PROTOCOL || "https";
  return `${protocol}://${host}`;
};

/**
 * Adds a specified path to the base URL.
 * This function appends a given path to the base URL created by `createBaseUrl()`.
 *
 * @param {string} path - The path to be appended to the base URL.
 * @returns {string} The complete URL with the path appended (e.g., "https://example.com/path").
 */
export const addBaseUrl = (path: string): string => {
  return `${createBaseUrl()}${path}`;
};

/**
 * Retrieves a query parameter from URLSearchParams as a string or undefined.
 * This function gets the value associated with the specified key from URL search parameters.
 *
 * @typeParam T - A generic type that extends an object where keys are strings and values are optional strings.
 * @param {URLSearchParams} searchParams - The URLSearchParams instance to search.
 * @param {keyof T} key - The key of the query parameter to retrieve.
 * @returns {string | undefined} The value of the query parameter, or undefined if the key does not exist.
 */
export const getQueryParam = <T extends Record<string, string | undefined>>(
  searchParams: URLSearchParams,
  key: keyof T,
): string | undefined => {
  const value = searchParams.get(key as string); // Cast key to string type
  return value ?? undefined;
};

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
export const createQueryParamsProxy = <
  T extends Record<string, string | undefined>,
>(
  searchParams: URLSearchParams,
): T => {
  return new Proxy({} as T, {
    get: (_, prop: string) => {
      // Returns the value for the given prop, or undefined if not present
      return searchParams.get(prop) ?? undefined;
    },
  });
};
