"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import React, { useState, useEffect, Suspense } from "react";

const SignInForm = () => {
  const [userInfo, setUserInfo] = useState({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      switch (errorParam) {
        case "CredentialsSignin":
          setError("ユーザー名またはパスワードが正しくありません。");
          break;
        case "SessionRequired":
          setError("セッションが必要です。再度サインインしてください。");
          break;
        default:
          setError("サインイン中にエラーが発生しました。再試行してください。");
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userInfo.username || !userInfo.password) {
      setError("ユーザー名とパスワードを入力してください。");
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      redirect: false,
      username: userInfo.username,
      password: userInfo.password,
      callbackUrl: "/admin",
    });

    setIsLoading(false);

    if (result?.error) {
      setError(result.error);
    } else if (result?.url) {
      router.push(result.url);
    }
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
        <form onSubmit={handleSubmit} className="space-y-4">
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
              isLoading ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "サインイン中..." : "サインイン"}
          </button>
        </form>
      </div>
    </div>
  );
};

const SignInPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <SignInForm />
  </Suspense>
);

export default SignInPage;
