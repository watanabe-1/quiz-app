import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import Header from "@/components/layout/Header";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { fetchGetYearsByQualificationAndGrade } from "@/lib/api";
import { nonLinkableSegmentsByQuiz } from "@/lib/constants";
import { path_quiz_Dqualification_Dgrade_Dyear } from "@/lib/path";

type Params = Promise<{
  qualification: string;
  grade: string;
}>;

export const metadata: Metadata = {
  title: "年度選択",
};

const YearsPage = async (props: { params: Params }) => {
  const params = await props.params;
  const qualification = decodeURIComponent(params.qualification);
  const grade = decodeURIComponent(params.grade);
  const years = await fetchGetYearsByQualificationAndGrade(
    qualification,
    grade,
  );

  return (
    <div>
      <Header title={`${qualification}の年度を選択`} />
      <main className="pl-6 pr-6 pt-3">
        <Breadcrumb nonLinkableSegments={nonLinkableSegmentsByQuiz} />
        <div className="mt-3">
          <ul className="space-y-2">
            {years.map((year) => (
              <li key={year}>
                <Link
                  href={
                    path_quiz_Dqualification_Dgrade_Dyear(
                      qualification,
                      grade,
                      year,
                    ).$url().path
                  }
                  className="block rounded bg-white p-4 shadow hover:bg-blue-50"
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
