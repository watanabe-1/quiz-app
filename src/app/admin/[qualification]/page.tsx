import React from "react";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { nonLinkableSegmentsByAdmin } from "@/lib/constants";
import { fetchGetGradesByQualification } from "@/lib/api";
import { createPath } from "@/lib/path";

interface Params {
  qualification: string;
}

const QualificationAdminPage = async ({ params }: { params: Params }) => {
  const qualification = decodeURIComponent(params.qualification);
  const grades = await fetchGetGradesByQualification(qualification);

  return (
    <div>
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">{qualification} の管理</h1>
        <Link href="/api/auth/signout" className="text-sm underline">
          サインアウト
        </Link>
      </header>
      <main className="p-6">
        <Breadcrumb nonLinkableSegments={nonLinkableSegmentsByAdmin} />
        <h2 className="text-xl font-semibold mb-4">級一覧</h2>
        <ul className="space-y-2">
          {grades.map((grade) => (
            <li key={grade} className="p-4 bg-white rounded shadow">
              <div className="flex justify-between items-center">
                <span>{grade}</span>
                <Link
                  href={createPath("admin", qualification, grade)}
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

export default QualificationAdminPage;
