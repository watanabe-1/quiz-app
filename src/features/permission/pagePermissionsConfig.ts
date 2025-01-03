import {
  API_AUTH_PREFIX,
  LOGIN_REDIRECT,
} from "@/features/auth/lib/authConstants";
import { Role } from "@/types/next-auth";

/**
 * Defines the role hierarchy to determine which roles inherit permissions from others.
 */
export const roleHierarchy: Record<Role, Role[]> = {
  guest: ["guest", "user", "admin"],
  user: ["user", "admin"],
  admin: ["admin"],
} as const;

/**
 * Defines the protected paths for each role.
 */
export const protectedPaths: Record<Role, string[]> = {
  guest: process.env.GUEST_PROTECTED_PATHS
    ? process.env.GUEST_PROTECTED_PATHS.split(",")
    : [LOGIN_REDIRECT, API_AUTH_PREFIX],
  user: process.env.USER_PROTECTED_PATHS
    ? process.env.USER_PROTECTED_PATHS.split(",")
    : ["/", "/quiz", "/api"],
  admin: ["/admin", "/api/admin"],
} as const;

/**
 * Default access policy for paths not explicitly defined in the permission map.
 */
export const DEFAULT_ACCESS_ALLOWED = false;
