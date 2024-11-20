import { Role } from "@/types/next-auth";

/**
 * Represents the permission kinds available in the system.
 */
export type PermissionKind = "viewer" | "editor" | "admin";

/**
 * Defines the permissions for each role.
 */
export const rolePermissions: Record<Role, PermissionKind[]> = {
  guest: ["viewer"], // Guest can only view
  user: ["viewer"], // User can only view (other permissions can be added later)
  admin: ["viewer", "editor", "admin"], // Admin has all permissions
} as const;

/**
 * Defines the permissions required for different data operations.
 */
export const dataPermissions: Record<string, PermissionKind[]> = {
  searchable: ["viewer", "editor", "admin"], // All roles can search
  addable: ["editor", "admin"], // Editor and admin can add
  editable: ["editor", "admin"], // Editor and admin can edit
  deletable: ["admin"], // Only admin can delete
} as const;
