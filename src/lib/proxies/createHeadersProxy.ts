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
 * Creates a proxy object for dynamically managing HTTP headers, enabling property-based access
 * for retrieval and updating of individual header values, as well as a method for retrieving
 * the entire `Headers` object.
 *
 * - When a `NextRequest` instance is provided, the returned proxy allows headers to be both retrieved
 *   and modified through direct property access, making it possible to read or update header values
 *   without needing to call a `get` or `set` method.
 * - If the `request` parameter is omitted, headers become immutable, where properties can be read
 *   but any attempt to modify them will result in a compile-time error.
 *
 * ### Usage
 * - **Retrieve a header**: Access any header directly as a property, e.g., `headersProxy.Authorization`
 *   to get the value of the `Authorization` header.
 * - **Update a header** (mutable only): Assign a new value to a property, e.g., `headersProxy.Authorization = "Bearer token"`
 *   to set a new value for the `Authorization` header.
 * - **Get all headers**: Use `getHeaders()` to retrieve the entire `Headers` object, allowing for
 *   further inspection or manipulation.
 *
 * This proxy design offers intuitive, type-safe access to headers with caching for efficient retrieval.
 *
 * @param request - An optional `NextRequest` instance to initialize header values.
 *                  If omitted, defaults to `await headers()` and provides an immutable proxy.
 * @returns {Promise<CustomizableRequestHeaders | Readonly<CustomizableRequestHeaders>>} A proxy object that
 *          supports property-based access for individual headers and modification if headers are mutable.
 *
 * @example
 * // Example 1: Creating a mutable headers proxy with a `NextRequest` instance
 * async function exampleMutableProxy(request: NextRequest) {
 *   const headersProxy = await createHeadersProxy(request);
 *   console.log(headersProxy.Authorization); // Retrieve the 'Authorization' header as a property
 *   headersProxy.Authorization = "Bearer token"; // Update the 'Authorization' header directly
 *   console.log(headersProxy.getHeaders()); // Retrieve the entire Headers object
 * }
 *
 * @example
 * // Example 2: Creating an immutable headers proxy with default headers
 * async function exampleImmutableProxy() {
 *   const headersProxy = await createHeadersProxy();
 *   console.log(headersProxy.Authorization); // Retrieve the 'Authorization' header as a property
 *   // headersProxy.Authorization = "Bearer token"; // This would cause a compile-time error
 *   console.log(headersProxy.getHeaders()); // Retrieve the entire Headers object
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
