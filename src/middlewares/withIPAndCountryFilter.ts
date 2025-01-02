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
 * An array of country codes that are allowed to access the system.
 *
 * @remarks
 * - The allowed countries are populated from the `ALLOWED_COUNTRIES` environment variable.
 * - Country codes should be specified in ISO 3166-1 alpha-2 format as a comma-separated string.
 *
 * @example
 * ```env
 * ALLOWED_COUNTRIES=JP,US
 * ```
 *
 * @example
 * ```typescript
 * if (!allowedCountries.includes("JP")) {
 *   console.log("Country not allowed");
 * }
 * ```
 */
const allowedCountries = (process.env.ALLOWED_COUNTRIES || "")
  .split(",")
  .map((country) => country.trim());

/**
 * Wraps a given middleware with IP and country filtering, using environment variables for configuration.
 *
 * @param middleware - The `NextMiddleware` function to be executed after filtering.
 * @returns A new middleware function that applies IP and country filtering rules before executing the provided middleware.
 *
 * @remarks
 * - This middleware checks the incoming request's IP against a blacklist.
 * - It verifies the request's country and allows only specific countries.
 * - The blacklist and allowed countries are configured via environment variables.
 *
 * @example
 * ```typescript
 * import { withIPAndCountryFilter } from "@/middlewares/withIPAndCountryFilter";
 *
 * const myMiddleware: NextMiddleware = async (req, event) => {
 *   console.log("Filtered request:", req.url);
 *   return NextResponse.next();
 * };
 *
 * export default withIPAndCountryFilter(myMiddleware);
 * ```
 */
export function withIPAndCountryFilter(middleware: NextMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    // IPアドレス、国情報を取得（Vercel環境などで自動的に付与されるヘッダー）を取得
    const { "x-forwarded-for": ip, "x-vercel-ip-country": country } =
      await createHeadersProxy(request);

    // ipがブラックリストに入っているか判定
    if (!ip || blacklist.has(ip)) {
      return NextResponse.json(
        { message: "Access denied: Blacklisted IP" },
        { status: 403 },
      );
    }

    // 国情報が取得できなかった場合は素通り（基本的にはローカル環境を想定）
    if (country && !allowedCountries.includes(country)) {
      return NextResponse.json(
        { message: "Access denied: Restricted country" },
        { status: 403 },
      );
    }

    // フィルタリング後に元のミドルウェアを実行
    return middleware(request, event);
  };
}
