import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server";
import {
  API_AUTH_PREFIX,
  LOGIN_ROUTE,
} from "@/features/auth/lib/authConstants";
import { permission } from "@/features/permission/lib/permission";
import { withPermissionAll } from "@/features/permission/lib/withPermissionAll";

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

    const isApiAuthRoute = pathname.startsWith(API_AUTH_PREFIX);

    if (isApiAuthRoute) {
      return middleware(request, event);
    }

    // 認証の実行
    return withPermissionAll(
      async () => {
        return middleware(request, event);
      },
      [permission.page.access(pathname)],
      async () => {
        return NextResponse.redirect(new URL(LOGIN_ROUTE, nextUrl));
      },
    );
  };
}
