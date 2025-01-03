import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server";
import { createHeadersProxy } from "@/lib/proxies/createHeadersProxy";

/**
 * A set of IP addresses that are blacklisted and should be denied access.
 *
 * @remarks
 * - The blacklist is populated from the `BLACKLISTED_IPS` environment variable.
 * - IPs should be specified as a comma-separated string in the environment variable.
 *
 * @example
 * ```env
 * BLACKLISTED_IPS=192.168.1.1,203.0.113.0
 * ```
 *
 * @example
 * ```typescript
 * if (blacklist.has("192.168.1.1")) {
 *   console.log("Access denied");
 * }
 * ```
 */
const blacklist = new Set(
  (process.env.BLACKLISTED_IPS || "").split(",").map((ip) => ip.trim()),
);

/**
 * Middleware to filter requests based on blacklisted IP addresses.
 *
 * @remarks
 * - The blacklist is configured via the `BLACKLISTED_IPS` environment variable.
 * - If the request's IP address is blacklisted, a 403 response is returned.
 *
 * @param middleware - The `NextMiddleware` function to execute if the request passes the IP filter.
 * @returns A new middleware function that applies IP filtering before executing the provided middleware.
 *
 * @example
 * ```typescript
 * import { withIpFilter } from "@/middlewares/withIpFilter";
 *
 * const myMiddleware: NextMiddleware = async (req, event) => {
 *   console.log("Request passed IP filter:", req.url);
 *   return NextResponse.next();
 * };
 *
 * export default withIpFilter(myMiddleware);
 * ```
 */
export function withIPFilter(middleware: NextMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    // IPアドレス、国情報を取得を取得
    const { "x-forwarded-for": ip } = await createHeadersProxy(request);

    // ipがブラックリストに入っているか判定
    if (!ip || blacklist.has(ip)) {
      return NextResponse.json(
        { message: "Access denied: Blacklisted IP" },
        { status: 403 },
      );
    }

    // フィルタリング後に元のミドルウェアを実行
    return middleware(request, event);
  };
}
