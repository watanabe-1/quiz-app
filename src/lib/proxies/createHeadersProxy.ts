import { headers as nextHeaders } from "next/headers";
import { CustomizableRequestHeaders } from "@/@types/quizType";

// 関数のオーバーロードを定義
export function createHeadersProxy(
  headers: Headers,
): Promise<CustomizableRequestHeaders>;
export function createHeadersProxy(): Promise<
  Readonly<CustomizableRequestHeaders>
>;

/**
 * Creates a proxy object for managing HTTP headers with caching.
 * This function returns a proxy that supports dynamic retrieval and, if specified, setting of HTTP headers
 * according to the structure defined in CustomizableRequestHeaders.
 *
 * When a headers argument is provided, the returned proxy allows setting headers using set.
 * When omitted, the headers are immutable, and any attempt to set a header will result in a compile-time error.
 *
 * @param headers - An optional instance of Headers to initialize header values.
 *                  If omitted, defaults to await headers() and provides an immutable proxy.
 * @returns {CustomizableRequestHeaders | Readonly<CustomizableRequestHeaders>} A proxy object that allows flexible
 *          access and, if headers are mutable, modification of HTTP headers.
 *
 * @example
 * // Usage with mutable headers (headers are passed as an argument)
 * import { headers } from "next/headers";
 * const headersInstance = await headers();
 * const mutableProxy = await createHeadersProxy(headersInstance);
 *
 * // Retrieving a header value
 * console.log(mutableProxy['X-Requested-With']); // might log "XMLHttpRequest" or undefined
 *
 * // Setting a header value (only works if headers were passed in)
 * mutableProxy['X-Custom-Header'] = 'custom-value';
 *
 * @example
 * // Usage with immutable headers (no headers argument provided)
 * const immutableProxy = await createHeadersProxy();
 *
 * // Retrieving a header value
 * console.log(immutableProxy['X-Requested-With']); // might log "XMLHttpRequest" or undefined
 *
 * // Trying to set a header value results in a compile-time error
 * // immutableProxy['X-Custom-Header'] = 'custom-value'; // Error: Property 'X-Custom-Header' does not exist on type 'Readonly<CustomizableRequestHeaders>'.
 */
export async function createHeadersProxy(
  headers?: Headers,
): Promise<CustomizableRequestHeaders | Readonly<CustomizableRequestHeaders>> {
  const initialHeaders = headers ?? (await nextHeaders());

  // set を利用できる場合と利用できない場合で Proxy の挙動を分ける
  const proxyHandler: ProxyHandler<CustomizableRequestHeaders> = {
    /**
     * Retrieves the value of a header.
     * If the header is not found in initialHeaders, it returns undefined.
     *
     * @param _ - Unused target object reference.
     * @param prop - The name of the header to retrieve.
     * @returns The value of the requested header, or undefined if not present.
     */
    get: (_, prop: string) => {
      return initialHeaders.get(prop) ?? undefined;
    },
  };

  // headers が指定されている場合のみ、set メソッドを追加
  if (headers) {
    proxyHandler.set = (_, prop: string, value: string) => {
      initialHeaders.set(prop, value);
      return true;
    };
  }

  return new Proxy({} as CustomizableRequestHeaders, proxyHandler);
}
