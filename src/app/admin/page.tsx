import Link from "next/link";
import React from "react";
import { logout } from "@/features/auth/actions/logout";
import { fetchGetAllQualifications } from "@/lib/api";
import {
  path_admin_export,
  path_admin_qualification,
  path_admin_upload,
  path_admin_upload_businessCareer,
} from "@/lib/path";

const AdminDashboard = async () => {
  const qualifications = await fetchGetAllQualifications();

  return (
    <div>
      <header className="flex items-center justify-between bg-gray-800 p-4 text-white">
        <h1 className="text-2xl font-bold">管理者ダッシュボード</h1>
        <form
          action={async () => {
            "use server";

            await logout();
          }}
        >
          <button type="submit">Sign Out</button>
        </form>
      </header>
      <main className="p-6">
        <Link
          href={path_admin_upload().$url().path}
          className="mb-4 inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          問題データのアップロード
        </Link>
        <Link
          href={path_admin_upload_businessCareer().$url().path}
          className="mb-4 inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          問題データのアップロード(ビジキャリPDFから)
        </Link>
        <Link
          href={path_admin_export().$url().path}
          className="mb-4 inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          問題データのエクスポート
        </Link>
        <h2 className="mb-4 text-xl font-semibold">資格一覧</h2>
        <ul className="space-y-2">
          {qualifications.map((qualification) => (
            <li key={qualification} className="rounded bg-white p-4 shadow">
              <div className="flex items-center justify-between">
                <span>{qualification}</span>
                <Link
                  href={path_admin_qualification(qualification).$url().path}
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
