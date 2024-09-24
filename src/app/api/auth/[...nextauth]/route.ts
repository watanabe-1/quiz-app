// authOptions.ts
import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

// NextAuthの設定オプション
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "ユーザー名", type: "text" },
        password: { label: "パスワード", type: "password" },
      },
      async authorize(credentials) {
        const { username, password } = credentials as {
          username: string;
          password: string;
        };

        // 環境変数からユーザー名とパスワードを取得
        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (username === adminUsername && password === adminPassword) {
          // 必要に応じてロールなどの追加情報を返す
          return { id: "1", name: "Admin", role: "admin" };
        }
        throw new Error("ユーザー名またはパスワードが正しくありません");
      },
    }),
  ],
  pages: {
    signIn: process.env.SIGN_IN_PAGE || "/auth/signin",
  },
  // JWTの設定
  jwt: {
    maxAge: 60 * 60, // 1時間 (秒単位)
  },
  // セッションの設定
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1時間 (秒単位)
  },
  // コールバックの設定
  callbacks: {
    jwt: async ({ token, user }: { token: JWT; user?: User }) => {
      if (user) {
        token.id = user.id;
        token.name = user.name || "";
        // 追加情報をトークンに含める
        token.role = (user as any).role;
      }
      return token;
    },
    session: async ({ session, token }: { session: Session; token: JWT }) => {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        // 追加情報をセッションに含める
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
};

// NextAuthハンドラーのエクスポート
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
