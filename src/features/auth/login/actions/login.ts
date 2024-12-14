"use server";

import { parseWithZod } from "@conform-to/zod";
import { AuthError } from "next-auth";
import { signIn } from "@/features/auth/auth";
import { LOGIN_REDIRECT } from "@/features/auth/lib/authConstants";
import { loginSchema } from "@/features/auth/login/lib/logInFormSchema";
import { FormState, ServerActionHandler } from "@/types/conform";

export const login: ServerActionHandler = async (
  prevState: FormState,
  data: FormData,
): Promise<FormState> => {
  const submission = parseWithZod(data, {
    schema: loginSchema,
  });

  if (submission.status !== "success") {
    return {
      status: "error",
      submission: submission.reply(),
    };
  }

  const value = submission.value;
  const { username, password } = value;

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
              formErrors: ["メールアドレスまたはパスワードが間違っています。"],
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
};
