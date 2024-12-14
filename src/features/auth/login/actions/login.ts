"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/features/auth/auth";
import { LOGIN_REDIRECT } from "@/features/auth/lib/authConstants";
import { loginSchema } from "@/features/auth/login/lib/logInFormSchema";
import { permission } from "@/features/permission/lib/permission";
import { createServerAction } from "@/lib/createServerAction";
import { path_auth_login } from "@/lib/path";

export const login = createServerAction(
  loginSchema,
  [permission.page.access(path_auth_login().$url().path)],
  async (submission) => {
    const { username, password } = submission.value;

    try {
      // NextAuthのsignIn関数を使用してログイン
      await signIn("credentials", {
        username,
        password,
        redirectTo: LOGIN_REDIRECT,
      });

      return {
        status: "success",
        message: "ログインに成功しました",
        submission: submission.reply(),
      };
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return {
              status: "error",
              submission: submission.reply({
                formErrors: [
                  "メールアドレスまたはパスワードが間違っています。",
                ],
              }),
            };
          default:
            return {
              status: "error",
              submission: submission.reply({
                formErrors: ["ログインに失敗しました。"],
              }),
            };
        }
      }

      throw error;
    }
  },
);
