import React from "react";
import Link from "next/link";
import { getYearsByQualificationAndGrade } from "@/services/quizService";
import Header from "@/components/layout/Header";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { nonLinkableSegmentsByQuiz } from "@/lib/constants";

interface Params {
  qualification: string;
  grade: string;
}

const YearsPage = async ({ params }: { params: Params }) => {
  const qualification = decodeURIComponent(params.qualification);
  const grade = decodeURIComponent(params.grade);
  const years = await getYearsByQualificationAndGrade(qualification, grade);

  return (
    <div>
      <Header title={`${qualification}の年度を選択`} />
      <main className="pt-3 pr-6 pl-6">
        <Breadcrumb nonLinkableSegments={nonLinkableSegmentsByQuiz} />
        <div className="mt-3">
          <ul className="space-y-2">
            {years.map((year) => (
              <li key={year}>
                <Link
                  href={`/quiz/${encodeURIComponent(
                    qualification
                  )}/${encodeURIComponent(grade)}/${encodeURIComponent(year)}`}
                  className="block p-4 bg-white rounded shadow hover:bg-blue-50"
                >
                  {year}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default YearsPage;
