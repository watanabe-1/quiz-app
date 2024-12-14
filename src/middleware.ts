import { chainMiddlewares } from "@/middlewares/chainMiddlewares";
import { withLogin } from "@/middlewares/withLogin";

// ミドルウェアを連結
export default chainMiddlewares([withLogin]);

export const config = {
  matcher: [
    /**
     * 以下のパスを除外しています：
     * - `_next/static`: Next.jsのビルド静的ファイル（例: CSS, JS）
     * - `_next/image`: Next.jsの画像最適化エンドポイント
     * - `favicon.ico`: サイトのファビコン
     * - 画像拡張子を持つ静的ファイル（例: `.svg`, `.png`, `.jpg`など）
     *
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
