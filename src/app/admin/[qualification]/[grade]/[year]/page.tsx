import React from "react";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { ALL_CATEGORY, nonLinkableSegmentsByAdmin } from "@/lib/constants";
import { fetchGetQuestionsByCategory } from "@/lib/api";
import { createPath } from "@/lib/path";

interface Params {
  qualification: string;
  grade: string;
  year: string;
}

const YearAdminPage = async ({ params }: { params: Params }) => {
  const qualification = decodeURIComponent(params.qualification);
  const grade = decodeURIComponent(params.grade);
  const year = decodeURIComponent(params.year);
  const questions = await fetchGetQuestionsByCategory(
    qualification,
    grade,
    year,
    ALL_CATEGORY
  );

  return (
    <div>
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {qualification} - {grade} - {year} の管理
        </h1>
        <Link href="/api/auth/signout" className="text-sm underline">
          サインアウト
        </Link>
      </header>
      <main className="p-6">
        <Breadcrumb nonLinkableSegments={nonLinkableSegmentsByAdmin} />
        <h2 className="text-xl font-semibold mb-4">問題一覧</h2>
        <ul className="space-y-2">
          {questions.map((question) => (
            <li
              key={question.questionId}
              className="p-4 bg-white rounded shadow"
            >
              <div className="flex justify-between items-center">
                <span>
                  {`問題${question.questionId} ${question.question.text}` ||
                    "（テキストなし）"}
                </span>
                <Link
                  href={createPath(
                    "admin",
                    qualification,
                    grade,
                    year,
                    "edit",
                    question.questionId
                  )}
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
