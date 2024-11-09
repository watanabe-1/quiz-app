import { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";

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
    const { pathname } = request.nextUrl;

    // Determine if the request path requires admin access
    const isAdminProtectedPath = adminProtectedPaths.some((pathRegex) =>
      pathRegex.test(pathname),
    );

    // Determine if the request path requires user access
    const isUserProtectedPath = userProtectedPaths.some((pathRegex) =>
      pathRegex.test(pathname),
    );

    if (isAdminProtectedPath || isUserProtectedPath) {
      const authMiddleware = withAuth(
        (req: NextRequestWithAuth) => {
          return middleware(req, event); // Call the next middleware after authentication
        },
        {
          callbacks: {
            /**
             * Authorization callback to verify user roles.
             * @param token - The token object containing user details.
             * @returns `true` if the user is authorized, otherwise `false`.
             */
            authorized: ({ token }) => {
              // Admin paths require the 'admin' role
              if (isAdminProtectedPath) {
                return !!token && token.role === "admin";
              }

              // User paths require the 'user' or 'admin' role
              if (isUserProtectedPath) {
                return (
                  !!token && (token.role === "user" || token.role === "admin")
                );
              }

              // For other paths, deny access
              return false;
            },
          },
        },
      );
      return authMiddleware(request as NextRequestWithAuth, event);
    }

    // If no authentication is required, execute the original middleware
    return middleware(request, event);
  };
}
