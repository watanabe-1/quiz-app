"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/features/auth/auth";
import { LOGIN_REDIRECT } from "@/features/auth/lib/authConstants";
import { loginSchema } from "@/features/auth/login/lib/logInFormSchema";
import { client } from "@/lib/client";
import { createServerAction } from "@/lib/createServerAction";

export const login = createServerAction(
  loginSchema,
  client.auth.login.$url().relativePath,
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
