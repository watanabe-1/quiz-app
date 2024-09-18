import React from "react";
import Link from "next/link";
import { getQuestions } from "../../../../lib/questions";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

interface Params {
  qualification: string;
  year: string;
}

const YearAdminPage = async ({ params }: { params: Params }) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const { qualification, year } = params;
  const questions = await getQuestions(qualification, year);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {qualification} - {year} の管理
        </h1>
        <Link href="/api/auth/signout" className="text-sm underline">
          サインアウト
        </Link>
      </header>
      <main className="p-6">
        <Link
          href={`/admin/${encodeURIComponent(qualification)}`}
          className="inline-block mb-4 text-blue-600 hover:underline"
        >
          ← 戻る
        </Link>
        <h2 className="text-xl font-semibold mb-4">問題一覧</h2>
        <ul className="space-y-2">
          {questions.map((question) => (
            <li key={question.id} className="p-4 bg-white rounded shadow">
              <div className="flex justify-between items-center">
                <span>{question.question}</span>
                <Link
                  href={`/admin/${encodeURIComponent(
                    qualification
                  )}/${encodeURIComponent(year)}/edit/${question.id}`}
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

export default YearAdminPage;
