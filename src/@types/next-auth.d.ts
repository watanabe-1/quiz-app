import { DefaultSession, DefaultUser } from "next-auth";

/**
 * Defines the roles available for users in the application.
 */
type Role = "user" | "admin";

declare module "next-auth" {
  /**
   * Extends the Session interface in NextAuth to include custom user fields.
   */
  interface Session {
    user: {
      /** Unique identifier for the user. */
      id: string;
      /** Optional name of the user. */
      name?: string;
      /** Optional role of the user, defining permissions and access level. */
      role?: Role;
    } & DefaultSession["user"];
  }

  /**
   * Extends the User interface in NextAuth to include custom fields for user identification and role.
   */
  interface User extends DefaultUser {
    /** Unique identifier for the user. */
    id: string;
    /** Optional role of the user, defining permissions and access level. */
    role?: Role;
  }
}

declare module "next-auth/jwt" {
  /**
   * Extends the JWT (JSON Web Token) interface in NextAuth to include additional fields for user identity and role.
   */
  interface JWT {
    /** Optional unique identifier for the user associated with the token. */
    id?: string;
    /** Optional name of the user associated with the token. */
    name?: string;
    /** Optional role of the user, used for permissions and access level. */
    role?: Role;
  }
}
