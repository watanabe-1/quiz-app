import React from "react";
import Link from "next/link";
import { getCategories } from "../../../../lib/questions";
import { ALL_CATEGORY } from "@/lib/constants";
import Header from "@/components/ui/Header";

interface Params {
  qualification: string;
  year: string;
}

const CategoriesPage = async ({ params }: { params: Params }) => {
  const qualification = decodeURIComponent(params.qualification);
  const year = decodeURIComponent(params.year);
  const categories = await getCategories(qualification, year);

  // 「すべての問題」を先頭に追加
  categories.unshift(ALL_CATEGORY);

  return (
    <div>
      <Header
        title={`${qualification} - ${year} のカテゴリを選択してください`}
      />
      <main className="p-6">
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category}>
              <Link
                href={`/quiz/${encodeURIComponent(
                  qualification
                )}/${encodeURIComponent(year)}/${encodeURIComponent(category)}`}
                className="block p-4 bg-white rounded shadow hover:bg-blue-50"
              >
                {category === ALL_CATEGORY ? "全ての問題" : category}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default CategoriesPage;
