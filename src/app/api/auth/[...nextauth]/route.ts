import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

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

        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (username === adminUsername && adminPasswordHash) {
          // 入力されたパスワードとハッシュ化されたパスワードを比較
          const isPasswordValid = await bcrypt.compare(
            password,
            adminPasswordHash
          );
          if (isPasswordValid) {
            return { id: "1", name: "Admin", role: "admin" };
          }
        }

        // 認証に失敗した場合はnullを返す
        throw new Error(
          process.env.AUTH_ERROR_MESSAGE ||
            "ユーザー名またはパスワードが正しくありません"
        );
      },
    }),
  ],
  pages: {
    signIn: process.env.SIGN_IN_PAGE || "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    maxAge: 60 * 60, // 1時間 (秒単位)
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1時間 (秒単位)
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.name = user.name || "";
        token.role = (user as any).role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
};

// NextAuthハンドラーのエクスポート
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
