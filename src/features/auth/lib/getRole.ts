import { auth } from "@/features/auth/auth";
import { Role } from "@/types/next-auth";

/**
 * Retrieves the role of the currently authenticated user.
 *
 * @returns A promise that resolves to the user's role.
 *          Returns `"guest"` if the user is not authenticated
 *          or if their role is not defined.
 */
export const getRole = async (): Promise<Role> => {
  const session = await auth();

  if (!session?.user?.role) {
    return "guest";
  }

  return session.user.role;
};
