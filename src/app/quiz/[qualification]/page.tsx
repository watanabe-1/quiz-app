import React from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { nonLinkableSegmentsByQuiz } from "@/lib/constants";
import { fetchGetGradesByQualification } from "@/lib/api";
import { createPath } from "@/lib/path";
import { Metadata } from "next";

interface Params {
  qualification: string;
}

export const metadata: Metadata = {
  title: "資格選択",
};

const GradesPage = async ({ params }: { params: Params }) => {
  const qualification = decodeURIComponent(params.qualification);
  const grades = await fetchGetGradesByQualification(qualification);

  return (
    <div>
      <Header title={`${qualification}の級を選択`} />
      <main className="pt-3 pr-6 pl-6">
        <Breadcrumb nonLinkableSegments={nonLinkableSegmentsByQuiz} />
        <div className="mt-3">
          <ul className="space-y-2">
            {grades.map((grade) => (
              <li key={grade}>
                <Link
                  href={createPath("quiz", qualification, grade)}
                  className="block p-4 bg-white rounded shadow hover:bg-blue-50"
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
