"use client";

import React, { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">サインイン</h1>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
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
              className="w-full p-2 border rounded"
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
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
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
