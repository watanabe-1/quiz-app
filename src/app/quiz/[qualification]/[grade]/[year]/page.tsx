import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import Header from "@/components/layout/Header";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { fetchGetCategories } from "@/lib/api";
import { client } from "@/lib/client";
import { ALL_CATEGORY, nonLinkableSegmentsByQuiz } from "@/lib/constants";

type Params = Promise<{
  qualification: string;
  grade: string;
  year: string;
}>;

export const metadata: Metadata = {
  title: "カテゴリー選択",
};

const CategoriesPage = async (props: { params: Params }) => {
  const params = await props.params;
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
                  href={
                    client.quiz
                      ._qualification(qualification)
                      ._grade(grade)
                      ._year(year)
                      ._category(category)
                      .$url().path
                  }
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
