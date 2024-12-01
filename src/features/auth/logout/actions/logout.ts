"use server";

import { signOut } from "@/features/auth/auth";
import { LOGIN_ROUTE } from "@/features/auth/lib/authConstants";

type logoutSuccess = {
  success: true;
};

type logoutFailure = {
  success: false;
  message: string;
};

type logoutResult = logoutSuccess | logoutFailure;

export const logout = async (): Promise<logoutResult> => {
  // NextAuthのsignOut関数を使用してログアウト
  await signOut({ redirectTo: LOGIN_ROUTE });

  return {
    success: true,
  };
};
