import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server";
import { auth } from "@/features/auth/auth";
import {
  API_AUTH_PREFIX,
  LOGIN_ROUTE,
} from "@/features/auth/lib/authConstants";

/**
 * Array of regular expressions representing paths that require admin access.
 * These are loaded from the `ADMIN_PROTECTED_PATHS` environment variable.
 * If not set, defaults to `/admin` and `/api/admin` paths.
 */
const adminProtectedPaths = process.env.ADMIN_PROTECTED_PATHS
  ? process.env.ADMIN_PROTECTED_PATHS.split(",").map(
      (path) => new RegExp(`^${path.trim()}(\\/.*)?$`),
    )
  : [/^\/admin(\/.*)?$/, /^\/api\/admin(\/.*)?$/];

/**
 * Array of regular expressions representing paths that require user access.
 * These are loaded from the `USER_PROTECTED_PATHS` environment variable.
 * If not set, defaults to all paths and `/quiz`, `/api`.
 */
const userProtectedPaths = process.env.USER_PROTECTED_PATHS
  ? process.env.USER_PROTECTED_PATHS.split(",").map(
      (path) => new RegExp(`^${path.trim()}(\\/.*)?$`),
    )
  : [/^\/(\/.*)?$/, /^\/quiz(\/.*)?$/, /^\/api(\/.*)?$/];

/**
 * Wraps a given middleware with NextAuth authentication.
 *
 * @param middleware - The `NextMiddleware` function to be executed after authentication.
 * @returns A new middleware function that ensures authentication based on path protection rules.
 *
 * @remarks
 * This middleware checks if the current request path is protected:
 * - If the path requires admin access, it ensures the user has the role `admin`.
 * - If the path requires user access, it ensures the user has the role `user` or `admin`.
 * - If the path is not protected, it simply runs the provided middleware.
 *
 * @example
 * ```typescript
 * import { withLogin } from "@/middlewares/withLogin";
 *
 * const myMiddleware: NextMiddleware = async (req, event) => {
 *   console.log("Authenticated request:", req.url);
 *   return NextResponse.next();
 * };
 *
 * export default withLogin(myMiddleware);
 * ```
 */
export function withLogin(middleware: NextMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const { nextUrl } = request;
    const { pathname } = nextUrl;

    const isApiAuthRoute = nextUrl.pathname.startsWith(API_AUTH_PREFIX);

    if (isApiAuthRoute) {
      return middleware(request, event);
    }

    // 認証の実行
    const session = await auth();
    const user = session?.user;

    // Determine if the request path requires admin access
    const isAdminProtectedPath = adminProtectedPaths.some((pathRegex) =>
      pathRegex.test(pathname),
    );

    // Determine if the request path requires user access
    const isUserProtectedPath = userProtectedPaths.some((pathRegex) =>
      pathRegex.test(pathname),
    );

    // Check authentication and roles
    if (isAdminProtectedPath) {
      if (!user || user.role !== "admin") {
        return NextResponse.redirect(new URL(LOGIN_ROUTE, nextUrl));
      }
    } else if (isUserProtectedPath) {
      if (!user || (user.role !== "user" && user.role !== "admin")) {
        return NextResponse.redirect(new URL(LOGIN_ROUTE, nextUrl));
      }
    }

    return middleware(request, event);
  };
}
