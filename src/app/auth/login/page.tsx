"use client";

import React, { useState, Suspense, useTransition } from "react";
import { login } from "@/features/auth/actions/login";

const LogInForm = () => {
  const [userInfo, setUserInfo] = useState({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleLogin = async () => {
    startTransition(async () => {
      const { username, password } = userInfo;
      if (!username || !password) {
        setError("ユーザー名とパスワードを入力してください。");
        return;
      }

      setError(null);

      const ret = await login(username, password);

      if (ret.success) {
        // 明示的にクリアすることでログイン後はメモリに保持していないようにする
        setUserInfo({ username: "", password: "" });
      } else {
        setError(ret.message);
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded bg-white p-6 shadow">
        <h1 className="mb-6 text-center text-2xl font-bold">サインイン</h1>
        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}
        <form action={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium">
              ユーザー名
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="ユーザー名"
              value={userInfo.username}
              onChange={(e) =>
                setUserInfo({ ...userInfo, username: e.target.value })
              }
              className="w-full rounded border p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              パスワード
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="パスワード"
              value={userInfo.password}
              onChange={(e) =>
                setUserInfo({ ...userInfo, password: e.target.value })
              }
              className="w-full rounded border p-2"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full rounded bg-blue-600 py-2 text-white transition duration-200 hover:bg-blue-700 ${
              isPending ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={isPending}
          >
            {isPending ? "サインイン中..." : "サインイン"}
          </button>
        </form>
      </div>
    </div>
  );
};

const SignInPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <LogInForm />
  </Suspense>
);

export default SignInPage;
