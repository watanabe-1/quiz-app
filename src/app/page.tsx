import React from "react";
import Link from "next/link";
import { getAllQuestions } from "../lib/questions";

interface Question {
  category: string;
}

const HomePage = async () => {
  const questions: Question[] = await getAllQuestions();
  const categories: string[] = Array.from(
    new Set(questions.map((q: Question) => q.category))
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">クイズアプリへようこそ</h1>
      </header>
      <main className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          カテゴリを選択してください
        </h2>
        <ul className="space-y-2">
          {categories.map((category: string, index: number) => (
            <li key={index}>
              <Link
                href={`/category/${encodeURIComponent(category)}`}
                className="block p-4 bg-white rounded shadow hover:bg-blue-50"
              >
                {category}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default HomePage;
