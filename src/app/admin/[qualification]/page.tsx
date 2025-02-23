import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import Header from "@/components/layout/Header";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { fetchGetGradesByQualification } from "@/lib/api";
import { client } from "@/lib/client";
import { nonLinkableSegmentsByAdmin } from "@/lib/constants";

type Params = Promise<{
  qualification: string;
}>;

export const metadata: Metadata = {
  title: "級選択",
};

const QualificationAdminPage = async (props: { params: Params }) => {
  const params = await props.params;
  const qualification = decodeURIComponent(params.qualification);
  const grades = await fetchGetGradesByQualification(qualification);

  return (
    <div>
      <Header title={`${qualification} の管理`} />
      <main className="p-6">
        <Breadcrumb nonLinkableSegments={nonLinkableSegmentsByAdmin} />
        <h2 className="mb-4 text-xl font-semibold">級一覧</h2>
        <ul className="space-y-2">
          {grades.map((grade) => (
            <li key={grade} className="rounded bg-white p-4 shadow">
              <div className="flex items-center justify-between">
                <span>{grade}</span>
                <Link
                  href={
                    client.admin
                      ._qualification(qualification)
                      ._grade(grade)
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
