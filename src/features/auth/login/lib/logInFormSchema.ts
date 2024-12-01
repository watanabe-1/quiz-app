import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(2, { message: "ユーザー名を入力してください。" }),
  password: z.string().min(1, { message: "パスワードを入力してください。" }),
});

export type LoginSchema = z.infer<typeof loginSchema>;
