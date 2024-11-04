import { headers } from "next/headers";
import { CustomizableRequestHeaders } from "@/@types/quizType";

/**
 * Creates a proxy object for managing HTTP headers.
 * The proxy supports dynamic retrieval and setting of headers as specified in `CustomizableRequestHeaders`.
 *
 * @returns {CustomizableRequestHeaders} A proxy object that allows flexible access and modification of HTTP headers.
 *
 * @example
 * ```typescript
 * const headersProxy = createHeadersProxy();
 *
 * // Retrieve an existing header
 * const userAgent = headersProxy['user-agent'];
 * console.log('User-Agent:', userAgent);
 *
 * // Set a custom header
 * headersProxy['x-url'] = 'https://example.com';
 * console.log('X-URL:', headersProxy['x-url']); // 'https://example.com'
 *
 * // Override a standard header
 * headersProxy['content-type'] = 'application/json';
 * console.log('Content-Type:', headersProxy['content-type']); // 'application/json'
 * ```
 */
export const createHeadersProxy = (): CustomizableRequestHeaders => {
  const internalHeaders = {} as CustomizableRequestHeaders;

  return new Proxy(internalHeaders, {
    /**
     * Handles retrieving the value of a header.
     * If the header is not found in `next/headers`, it attempts to retrieve it from `internalHeaders`.
     *
     * @param _ - Unused target object reference.
     * @param prop - The name of the header to retrieve.
     * @returns The value of the requested header, or `undefined` if not present.
     */
    get: (_, prop: string) => {
      return (
        headers().get(prop) ??
        internalHeaders[prop as keyof CustomizableRequestHeaders]
      );
    },
    /**
     * Handles setting the value of a header in the internal header store.
     *
     * @param _ - Unused target object reference.
     * @param prop - The name of the header to set.
     * @param value - The value to assign to the header.
     * @returns A boolean indicating the success of the set operation (`true`).
     */
    set: (_, prop: string, value: string) => {
      internalHeaders[prop as keyof CustomizableRequestHeaders] = value;
      return true;
    },
  });
};
