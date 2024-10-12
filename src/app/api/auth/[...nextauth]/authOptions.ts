import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
          // Compare the entered password with the hashed password
          const isPasswordValid = await bcrypt.compare(
            password,
            adminPasswordHash,
          );
          if (isPasswordValid) {
            return { id: "1", name: "Admin", role: "admin" };
          }
        }

        // Return null if authentication fails
        throw new Error(
          process.env.AUTH_ERROR_MESSAGE ||
            "ユーザー名またはパスワードが正しくありません",
        );
      },
    }),
  ],
  pages: {
    signIn: process.env.SIGN_IN_PAGE || "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    maxAge: 60 * 60, // 1 hour (in seconds)
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour (in seconds)
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.name = user.name || "";
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user && token.id) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.role = token.role;
      }
      return session;
    },
  },
};
