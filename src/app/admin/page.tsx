import React from "react";
import Link from "next/link";
import { fetchGetAllQualifications } from "@/lib/api";
import { createPath } from "@/lib/path";

const AdminDashboard = async () => {
  const qualifications = await fetchGetAllQualifications();

  return (
    <div>
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
        <Link
          href="/admin/uploadBccExam"
          className="inline-block mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          問題データのアップロード(ビジキャリPDFから)
        </Link>
        <Link
          href="/admin/export"
          className="inline-block mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          問題データのエクスポート
        </Link>
        <h2 className="text-xl font-semibold mb-4">資格一覧</h2>
        <ul className="space-y-2">
          {qualifications.map((qualification) => (
            <li key={qualification} className="p-4 bg-white rounded shadow">
              <div className="flex justify-between items-center">
                <span>{qualification}</span>
                <Link
                  href={createPath("admin", qualification)}
                  className="text-blue-600 hover:underline"
                >
                  管理
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
