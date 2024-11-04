import { headers as nextHeaders } from "next/headers";
import { NextRequest } from "next/server";
import { CustomizableRequestHeaders } from "@/@types/quizType";

// Define function overloads
export function createHeadersProxy(
  request: NextRequest,
): Promise<CustomizableRequestHeaders & { getHeaders: () => Headers }>;
export function createHeadersProxy(): Promise<
  Readonly<CustomizableRequestHeaders & { getHeaders: () => Headers }>
>;

/**
 * Creates a proxy object for managing HTTP headers with caching.
 * This function returns a proxy that supports dynamic retrieval and, if specified, setting of HTTP headers
 * according to the structure defined in `CustomizableRequestHeaders`.
 *
 * When a `NextRequest` argument is provided, the returned proxy allows setting headers using `set`.
 * When omitted, the headers are immutable, and any attempt to set a header will result in a compile-time error.
 *
 * @param request - An optional instance of `NextRequest` to initialize header values.
 *                  If omitted, defaults to `await headers()` and provides an immutable proxy.
 * @returns {Promise<CustomizableRequestHeaders | Readonly<CustomizableRequestHeaders>>} A proxy object that allows flexible
 *          access and, if headers are mutable, modification of HTTP headers.
 *
 * @example
 * // Example 1: Create a mutable headers proxy using an instance of NextRequest
 * async function exampleMutableProxy(request: NextRequest) {
 *   const headersProxy = await createHeadersProxy(request);
 *   console.log(headersProxy.getHeaders().get("Authorization")); // Retrieve the 'Authorization' header
 *   headersProxy.getHeaders().set("Authorization", "Bearer token"); // Set a new value for the 'Authorization' header
 * }
 *
 * @example
 * // Example 2: Create an immutable headers proxy with default headers
 * async function exampleImmutableProxy() {
 *   const headersProxy = await createHeadersProxy();
 *   console.log(headersProxy.getHeaders().get("Authorization")); // Retrieve the 'Authorization' header
 *   // headersProxy.getHeaders().set("Authorization", "Bearer token"); // This would cause a compile-time error
 * }
 */
export async function createHeadersProxy(
  request?: NextRequest,
): Promise<
  | (CustomizableRequestHeaders & { getHeaders: () => Headers })
  | Readonly<CustomizableRequestHeaders & { getHeaders: () => Headers }>
> {
  // Create a new Headers instance from request headers if request is provided
  const initialHeaders = request
    ? new Headers(request.headers)
    : await nextHeaders();

  // Configure Proxy behavior based on the presence of a mutable request
  const proxyHandler: ProxyHandler<
    CustomizableRequestHeaders & { getHeaders: () => Headers }
  > = {
    /**
     * Retrieves the value of a header or the Headers object itself.
     * If the header is not found in initialHeaders, it returns undefined.
     *
     * @param _ - Unused target object reference.
     * @param prop - The name of the header to retrieve, or 'getHeaders' to retrieve the entire Headers object.
     * @returns The value of the requested header, or undefined if not present.
     */
    get: (_, prop: string) => {
      if (prop === "getHeaders") return () => initialHeaders; // Return the Headers instance through getHeaders method
      return initialHeaders.get(prop) ?? undefined;
    },
  };

  // Only add set method if request headers are mutable
  if (request) {
    proxyHandler.set = (_, prop: string, value: string) => {
      initialHeaders.set(prop, value);
      return true;
    };
  }

  return new Proxy(
    {} as CustomizableRequestHeaders & { getHeaders: () => Headers },
    proxyHandler,
  );
}
