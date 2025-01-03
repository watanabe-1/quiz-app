import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server";
import { createHeadersProxy } from "@/lib/proxies/createHeadersProxy";

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
 * Middleware to filter requests based on allowed countries.
 *
 * @remarks
 * - The allowed countries are configured via the `ALLOWED_COUNTRIES` environment variable.
 * - If the request's country is not in the allowed list, a 403 response is returned.
 *
 * @param middleware - The `NextMiddleware` function to execute if the request passes the country filter.
 * @returns A new middleware function that applies country filtering before executing the provided middleware.
 *
 * @example
 * ```typescript
 * import { withCountryFilter } from "@/middlewares/withCountryFilter";
 *
 * const myMiddleware: NextMiddleware = async (req, event) => {
 *   console.log("Request passed country filter:", req.url);
 *   return NextResponse.next();
 * };
 *
 * export default withCountryFilter(myMiddleware);
 * ```
 */
export function withCountryFilter(middleware: NextMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    // 国情報を取得（Vercel環境などで自動的に付与されるヘッダー）を取得
    const { "x-vercel-ip-country": country } =
      await createHeadersProxy(request);

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
