import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import Header from "@/components/layout/Header";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { fetchGetGradesByQualification } from "@/lib/api";
import { nonLinkableSegmentsByQuiz } from "@/lib/constants";
import { createPath } from "@/lib/path";

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
      <main className="pl-6 pr-6 pt-3">
        <Breadcrumb nonLinkableSegments={nonLinkableSegmentsByQuiz} />
        <div className="mt-3">
          <ul className="space-y-2">
            {grades.map((grade) => (
              <li key={grade}>
                <Link
                  href={createPath("quiz", qualification, grade)}
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
