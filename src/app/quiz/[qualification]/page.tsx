import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import Header from "@/components/layout/Header";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { fetchGetGradesByQualification } from "@/lib/api";
import { nonLinkableSegmentsByQuiz } from "@/lib/constants";
import { path_quiz_Dqualification_Dgrade } from "@/lib/path";

type Params = Promise<{
  qualification: string;
}>;

export const metadata: Metadata = {
  title: "資格選択",
};

const GradesPage = async (props: { params: Params }) => {
  const params = await props.params;
  const qualification = decodeURIComponent(params.qualification);
  const grades = await fetchGetGradesByQualification(qualification);

  return (
    <div>
      <Header title={`${qualification}の級を選択`} />
      <main className="pl-6 pr-6 pt-3">
        <Breadcrumb nonLinkableSegments={nonLinkableSegmentsByQuiz} />
        <div className="mt-3">
          <ul className="space-y-2">
            {grades.map((grade) => (
              <li key={grade}>
                <Link
                  href={
                    path_quiz_Dqualification_Dgrade(qualification, grade).$url()
                      .path
                  }
                  className="block rounded bg-white p-4 shadow hover:bg-blue-50"
                >
                  {grade}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default GradesPage;
