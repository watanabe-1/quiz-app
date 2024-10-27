import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      role?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role?: "user" | "admin";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    name?: string;
    role?: "user" | "admin";
  }
}
