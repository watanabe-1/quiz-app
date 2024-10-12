import { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";

// 環境変数から保護するパスを取得
const protectedPaths = process.env.PROTECTED_PATHS
  ? process.env.PROTECTED_PATHS.split(",").map(
      (path) => new RegExp(`^${path.trim()}(\\/.*)?$`)
    )
  : [
      /^\/admin(\/.*)?$/, // デフォルトの保護パス
      /^\/api\/admin(\/.*)?$/, // デフォルトの保護パス
    ];

// NextAuth.jsのミドルウェア（認証）
export function withLogin(middleware: NextMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const { pathname } = request.nextUrl;

    // 認証が必要なパスかどうかを判定
    const isProtectedPath = protectedPaths.some((pathRegex) =>
      pathRegex.test(pathname)
    );

    if (isProtectedPath) {
      const authMiddleware = withAuth(
        (req: NextRequestWithAuth) => {
          return middleware(req, event); // 認証後に次のミドルウェアを呼び出す
        },
        {
          callbacks: {
            authorized: ({ token }) => {
              // トークンが存在し、かつ role が 'admin' であることを確認
              return !!token && token.role === "admin";
            },
          },
        }
      );
      return authMiddleware(request as NextRequestWithAuth, event);
    }

    // 認証不要な場合はそのまま次のミドルウェアを実行
    return middleware(request, event);
  };
}
