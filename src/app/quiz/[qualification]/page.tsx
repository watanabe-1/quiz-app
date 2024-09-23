import React from "react";
import Link from "next/link";
import { getYearsByQualification } from "../../../lib/questions";
import Header from "@/components/ui/Header";

interface Params {
  qualification: string;
}

const YearsPage = async ({ params }: { params: Params }) => {
  const qualification = decodeURIComponent(params.qualification);
  const years = await getYearsByQualification(qualification);

  return (
    <div>
      <Header title={`${qualification}の年度を選択`} />
      <main className="p-6">
        <ul className="space-y-2">
          {years.map((year) => (
            <li key={year}>
              <Link
                href={`/quiz/${encodeURIComponent(
                  qualification
                )}/${encodeURIComponent(year)}`}
                className="block p-4 bg-white rounded shadow hover:bg-blue-50"
              >
                {year}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default YearsPage;
