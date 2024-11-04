import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { fetchGetYearsByQualificationAndGrade } from "@/lib/api";
import { nonLinkableSegmentsByAdmin } from "@/lib/constants";
import { path_admin_qualification_grade_year } from "@/lib/path";

type Params = Promise<{
  qualification: string;
  grade: string;
}>;

export const metadata: Metadata = {
  title: "年度選択",
};

const QualificationAdminPage = async (props: { params: Params }) => {
  const params = await props.params;
  const qualification = decodeURIComponent(params.qualification);
  const grade = decodeURIComponent(params.grade);

  const years = await fetchGetYearsByQualificationAndGrade(
    qualification,
    grade,
  );

  return (
    <div>
      <header className="flex items-center justify-between bg-gray-800 p-4 text-white">
        <h1 className="text-2xl font-bold">{qualification} の管理</h1>
        <Link href="/api/auth/signout" className="text-sm underline">
          サインアウト
        </Link>
      </header>
      <main className="p-6">
        <Breadcrumb nonLinkableSegments={nonLinkableSegmentsByAdmin} />
        <h2 className="mb-4 text-xl font-semibold">年度一覧</h2>
        <ul className="space-y-2">
          {years.map((year) => (
            <li key={year} className="rounded bg-white p-4 shadow">
              <div className="flex items-center justify-between">
                <span>{year}</span>
                <Link
                  href={
                    path_admin_qualification_grade_year(
                      qualification,
                      grade,
                      year,
                    ).$url().path
                  }
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
