import { createHeadersProxy } from "@/lib/proxies/createHeadersProxy";

/**
 * Creates a base URL string based on the protocol and host.
 * If `NEXT_PUBLIC_PROTOCOL` is specified in environment variables, it is used as the protocol;
 * otherwise, "https" is used by default. The host is retrieved using `getHost()`.
 *
 * @returns {string} The full base URL (e.g., "https://example.com").
 * @throws Will throw an error if the host is not defined.
 */
const createBaseUrl = async (): Promise<string> => {
  const { host } = await createHeadersProxy();
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
export const addBaseUrl = async (path: string): Promise<string> => {
  return `${await createBaseUrl()}${path}`;
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
  const value = searchParams.get(key as string);

  return value ?? undefined;
};
