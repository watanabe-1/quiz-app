import Link from "next/link";
import React from "react";
import Header from "@/components/layout/Header";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { fetchGetAllQualifications } from "@/lib/api";
import { client } from "@/lib/client";

const AdminDashboard = async () => {
  const qualifications = await fetchGetAllQualifications();

  return (
    <div>
      <Header title="管理者ダッシュボード" />
      <main className="p-6">
        <div className="mb-4">
          <Breadcrumb />
        </div>
        <Link
          href={client.admin.upload.$url().path}
          className="mb-4 inline-block rounded-sm bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          問題データのアップロード
        </Link>
        <Link
          href={client.admin.upload.businessCareer.$url().path}
          className="mb-4 inline-block rounded-sm bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          問題データのアップロード(ビジキャリPDFから)
        </Link>
        <Link
          href={client.admin.export.$url().path}
          className="mb-4 inline-block rounded-sm bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          問題データのエクスポート
        </Link>
        <h2 className="mb-4 text-xl font-semibold">資格一覧</h2>
        <ul className="space-y-2">
          {qualifications.map((qualification) => (
            <li key={qualification} className="rounded-sm bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span>{qualification}</span>
                <Link
                  href={client.admin._qualification(qualification).$url().path}
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
