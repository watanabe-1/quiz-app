import React from "react";
import Link from "next/link";
import { getAllQuestions } from "../../lib/questions";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

interface Question {
  id: number;
  question: string;
}

const AdminDashboard = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const questions: Question[] = await getAllQuestions();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">管理者ダッシュボード</h1>
        <Link href="/api/auth/signout" className="text-sm underline">
          サインアウト
        </Link>
      </header>
      <main className="p-6">
        <Link
          href="/admin/upload"
          className="inline-block mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          問題データのアップロード
        </Link>
        <ul className="space-y-2">
          {questions.map((question) => (
            <li key={question.id} className="p-4 bg-white rounded shadow">
              <div className="flex justify-between items-center">
                <span>{question.question}</span>
                <Link
                  href={`/admin/edit/${question.id}`}
                  className="text-blue-600 hover:underline"
                >
                  編集
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default AdminDashboard;
