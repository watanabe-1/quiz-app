"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/features/auth/auth";
import { LOGIN_REDIRECT } from "@/features/auth/lib/authConstants";

type LoginSuccess = {
  success: true;
};

type LoginFailure = {
  success: false;
  message: string;
};

type LoginResult = LoginSuccess | LoginFailure;

export const login = async (
  username: string,
  password: string,
): Promise<LoginResult> => {
  try {
    console.log("🚀 ~ LOGIN_REDIRECT:", LOGIN_REDIRECT);

    // NextAuthのsignIn関数を使用してログイン
    await signIn("credentials", {
      username,
      password,
      redirectTo: LOGIN_REDIRECT,
    });

    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            message: "メールアドレスまたはパスワードが間違っています。",
          };
        default:
          return {
            success: false,
            message: "ログインに失敗しました。",
          };
      }
    }

    throw error;
  }
  console.log("🚀 ~ LOGIN_REDIRECT:", LOGIN_REDIRECT);
};
