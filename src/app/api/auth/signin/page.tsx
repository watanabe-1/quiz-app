"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";

const SignInPage = () => {
  const [userInfo, setUserInfo] = useState({ username: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn("credentials", {
      username: userInfo.username,
      password: userInfo.password,
      callbackUrl: "/admin",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">サインイン</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">ユーザー名</label>
            <input
              name="username"
              placeholder="ユーザー名"
              value={userInfo.username}
              onChange={(e) =>
                setUserInfo({ ...userInfo, username: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">パスワード</label>
            <input
              name="password"
              type="password"
              placeholder="パスワード"
              value={userInfo.password}
              onChange={(e) =>
                setUserInfo({ ...userInfo, password: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            サインイン
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
