import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import Header from "@/components/layout/Header";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { fetchGetQuestionsByCategory } from "@/lib/api";
import { ALL_CATEGORY, nonLinkableSegmentsByAdmin } from "@/lib/constants";
import { path_admin_Dqualification_Dgrade_Dyear_edit_Did } from "@/lib/path";

type Params = Promise<{
  qualification: string;
  grade: string;
  year: string;
}>;

export const metadata: Metadata = {
  title: "問題選択",
};

const YearAdminPage = async (props: { params: Params }) => {
  const params = await props.params;
  const qualification = decodeURIComponent(params.qualification);
  const grade = decodeURIComponent(params.grade);
  const year = decodeURIComponent(params.year);

  const questions = await fetchGetQuestionsByCategory(
    qualification,
    grade,
    year,
    ALL_CATEGORY,
  );

  return (
    <div>
      <Header title={`${qualification} - ${grade} - ${year} の管理`} />
      <main className="p-6">
        <Breadcrumb nonLinkableSegments={nonLinkableSegmentsByAdmin} />
        <h2 className="mb-4 text-xl font-semibold">問題一覧</h2>
        <ul className="space-y-2">
          {questions.map((question) => (
            <li
              key={question.questionId}
              className="rounded bg-white p-4 shadow"
            >
              <div className="flex items-center justify-between">
                <span>
                  {`問題${question.questionId} ${question.question.text}`}
                </span>
                <Link
                  href={
                    path_admin_Dqualification_Dgrade_Dyear_edit_Did(
                      qualification,
                      grade,
                      year,
                      question.questionId,
                    ).$url().path
                  }
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
