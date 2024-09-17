import React from "react";
import Link from "next/link";
import { getAllQuestions } from "../../../lib/questions";

interface Params {
  category: string;
}

interface Question {
  id: number;
  question: string;
}

const CategoryPage = async ({ params }: { params: Params }) => {
  const questions = await getAllQuestions();
  const category = decodeURIComponent(params.category);
  const categoryQuestions: Question[] = questions.filter(
    (q) => q.category === category
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">{category}の問題</h1>
      </header>
      <main className="p-6">
        <ul className="space-y-2">
          {categoryQuestions.map((question) => (
            <li key={question.id}>
              <Link
                href={`/${question.id}`}
                className="block p-4 bg-white rounded shadow hover:bg-blue-50"
              >
                {question.question}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default CategoryPage;
