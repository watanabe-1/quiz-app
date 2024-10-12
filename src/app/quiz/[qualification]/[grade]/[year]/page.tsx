import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import Header from "@/components/layout/Header";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { fetchGetCategories } from "@/lib/api";
import { ALL_CATEGORY, nonLinkableSegmentsByQuiz } from "@/lib/constants";
import { createPath } from "@/lib/path";

interface Params {
  qualification: string;
  grade: string;
  year: string;
}

export const metadata: Metadata = {
  title: "カテゴリー選択",
};

const CategoriesPage = async ({ params }: { params: Params }) => {
  const qualification = decodeURIComponent(params.qualification);
  const grade = decodeURIComponent(params.grade);
  const year = decodeURIComponent(params.year);
  const categories = await fetchGetCategories(qualification, grade, year);

  // 「すべての問題」を先頭に追加
  categories.unshift(ALL_CATEGORY);

  return (
    <div>
      <Header
        title={`${qualification} - ${grade} - ${year} のカテゴリを選択してください`}
      />
      <main className="pl-6 pr-6 pt-3">
        <Breadcrumb nonLinkableSegments={nonLinkableSegmentsByQuiz} />
        <div className="mt-3">
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category}>
                <Link
                  href={createPath(
                    "quiz",
                    qualification,
                    grade,
                    year,
                    category,
                  )}
                  className="block rounded bg-white p-4 shadow hover:bg-blue-50"
                >
                  {category === ALL_CATEGORY ? "全ての問題" : category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default CategoriesPage;
