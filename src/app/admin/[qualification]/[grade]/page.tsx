import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import Header from "@/components/layout/Header";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { fetchGetYearsByQualificationAndGrade } from "@/lib/api";
import { client } from "@/lib/client";
import { nonLinkableSegmentsByAdmin } from "@/lib/constants";

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
      <Header title={`${qualification} - ${grade} の管理`} />
      <main className="p-6">
        <Breadcrumb nonLinkableSegments={nonLinkableSegmentsByAdmin} />
        <h2 className="mb-4 text-xl font-semibold">年度一覧</h2>
        <ul className="space-y-2">
          {years.map((year) => (
            <li key={year} className="rounded-sm bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span>{year}</span>
                <Link
                  href={
                    client.admin
                      ._qualification(qualification)
                      ._grade(grade)
                      ._year(year)
                      .$url().path
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
