import React from "react";
import Link from "next/link";
import { getCategories } from "@/services/quizService";
import { ALL_CATEGORY, nonLinkableSegmentsByQuiz } from "@/lib/constants";
import Header from "@/components/layout/Header";
import Breadcrumb from "@/components/ui/Breadcrumb";

interface Params {
  qualification: string;
  grade: string;
  year: string;
}

const CategoriesPage = async ({ params }: { params: Params }) => {
  const qualification = decodeURIComponent(params.qualification);
  const grade = decodeURIComponent(params.grade);
  const year = decodeURIComponent(params.year);
  const categories = await getCategories(qualification, grade, year);

  // 「すべての問題」を先頭に追加
  categories.unshift(ALL_CATEGORY);

  return (
    <div>
      <Header
        title={`${qualification} - ${grade} - ${year} のカテゴリを選択してください`}
      />
      <main className="pt-3 pr-6 pl-6">
        <Breadcrumb nonLinkableSegments={nonLinkableSegmentsByQuiz} />
        <div className="mt-3">
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category}>
                <Link
                  href={`/quiz/${encodeURIComponent(
                    qualification
                  )}/${encodeURIComponent(grade)}/${encodeURIComponent(
                    year
                  )}/${encodeURIComponent(category)}`}
                  className="block p-4 bg-white rounded shadow hover:bg-blue-50"
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
