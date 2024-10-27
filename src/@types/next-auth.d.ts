import { DefaultSession, DefaultUser } from "next-auth";

type Role = "user" | "admin";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string;
      role?: Role;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role?: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    name?: string;
    role?: Role;
  }
}
