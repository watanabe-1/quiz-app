import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {
    // req
    // 認証されたユーザーのみが /admin にアクセス可能
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = { matcher: ["/admin/:path*", "/api/upload"] };
