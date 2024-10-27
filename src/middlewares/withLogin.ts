import { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";

// 環境変数から保護するパスを取得
const adminProtectedPaths = process.env.ADMIN_PROTECTED_PATHS
  ? process.env.ADMIN_PROTECTED_PATHS.split(",").map(
      (path) => new RegExp(`^${path.trim()}(\\/.*)?$`),
    )
  : [
      // デフォルトの保護パス
      /^\/admin(\/.*)?$/,
      /^\/api\/admin(\/.*)?$/,
    ];

const userProtectedPaths = process.env.USER_PROTECTED_PATHS
  ? process.env.USER_PROTECTED_PATHS.split(",").map(
      (path) => new RegExp(`^${path.trim()}(\\/.*)?$`),
    )
  : [
      // デフォルトの保護パス(全パス)
      /^\/(\/.*)?$/,
    ];

// NextAuth.jsのミドルウェア（認証）
export function withLogin(middleware: NextMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const { pathname } = request.nextUrl;

    // 管理者権限が必要なパスかどうかを判定
    const isAdminProtectedPath = adminProtectedPaths.some((pathRegex) =>
      pathRegex.test(pathname),
    );

    // ユーザー権限が必要なパスかどうかを判定
    const isUserProtectedPath = userProtectedPaths.some((pathRegex) =>
      pathRegex.test(pathname),
    );

    if (isAdminProtectedPath || isUserProtectedPath) {
      const authMiddleware = withAuth(
        (req: NextRequestWithAuth) => {
          return middleware(req, event); // 認証後に次のミドルウェアを呼び出す
        },
        {
          callbacks: {
            authorized: ({ token }) => {
              // 管理者パスには 'admin' の権限を要求
              if (isAdminProtectedPath) {
                return !!token && token.role === "admin";
              }

              // ユーザーパスには 'user' または 'admin' の権限を要求
              if (isUserProtectedPath) {
                return (
                  !!token && (token.role === "user" || token.role === "admin")
                );
              }

              // その他のパスは認可しない
              return false;
            },
          },
        },
      );
      return authMiddleware(request as NextRequestWithAuth, event);
    }

    // 認証不要な場合はそのまま次のミドルウェアを実行
    return middleware(request, event);
  };
}
