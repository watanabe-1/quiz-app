import withAuth, { NextRequestWithAuth } from "next-auth/middleware";
import { NextMiddleware, NextRequest, NextFetchEvent } from "next/server";

// 認証が必要なパス（正規表現に変換）
const authPaths = [
  /^\/admin(\/.*)?$/, // `/admin` とその配下
  /^\/api\/admin(\/.*)$/, // `/api/admin` とその配下
];

// NextAuth.jsのミドルウェア（認証）
export function widthLogin(middleware: NextMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const { pathname } = request.nextUrl;

    // 認証が必要なパスに対してのみ認証を適用
    const isAuthPath = authPaths.some((pathRegex) => pathRegex.test(pathname));

    if (isAuthPath) {
      const authMiddleware = withAuth(
        (req: NextRequestWithAuth) => {
          return middleware(req, event); // 認証後に次のミドルウェアを呼び出す
        },
        {
          callbacks: {
            authorized: ({ token }) => !!token, // 認証ロジック（トークンがあれば認証成功）
          },
        }
      );

      return authMiddleware(request as NextRequestWithAuth, event);
    }

    return middleware(request, event); // 認証不要ならそのまま次のミドルウェアを実行
  };
}
