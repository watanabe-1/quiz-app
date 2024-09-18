import React from "react";
import Link from "next/link";
import { getYearsByQualification } from "../../../lib/questions";

interface Params {
  qualification: string;
}

const YearsPage = async ({ params }: { params: Params }) => {
  const qualification = decodeURIComponent(params.qualification);
  const years = await getYearsByQualification(qualification);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">
          {qualification}の年度を選択してください
        </h1>
      </header>
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
