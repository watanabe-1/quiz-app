import { NextRequest, NextResponse } from "next/server";
import { createHeadersProxy } from "@/lib/proxies/createHeadersProxy";

/**
 * Creates a middleware function that sets headers for all incoming requests.
 *
 * @returns An asynchronous function that handles `NextRequest` and returns a `NextResponse`.
 *
 * @remarks
 * This middleware function:
 * - Sets custom headers using a proxy.
 * - Adds the `x-pathname` header with the current request's pathname.
 * - Adds the `x-url` header with the full request URL.
 *
 * @example
 * ```typescript
 * import { makeResponse } from "@/middlewares/makeResponse";
 *
 * const responseMiddleware = makeResponse();
 *
 * export default responseMiddleware;
 * ```
 */
export function makeResponse() {
  return async (request: NextRequest) => {
    const headersProxy = await createHeadersProxy(request);
    headersProxy["x-pathname"] = request.nextUrl.pathname;
    headersProxy["x-url"] = request.url;

    return NextResponse.next({
      request: {
        headers: headersProxy.getHeaders(),
      },
    });
  };
}
