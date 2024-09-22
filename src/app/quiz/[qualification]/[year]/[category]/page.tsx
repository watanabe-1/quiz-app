import React from "react";
import Link from "next/link";
import {
  getQuestions,
  getQuestionsByCategory,
} from "../../../../../lib/questions";
import { ALL_CATEGORY } from "@/lib/constants";

interface Params {
  qualification: string;
  year: string;
  category: string;
}

const QuestionsPage = async ({ params }: { params: Params }) => {
  const qualification = decodeURIComponent(params.qualification);
  const year = decodeURIComponent(params.year);
  const category = decodeURIComponent(params.category);
  const questions =
    category === ALL_CATEGORY
      ? await getQuestions(qualification, year)
      : await getQuestionsByCategory(qualification, year, category);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">
          {qualification} - {year} 年度 - {category} の問題一覧
        </h1>
      </header>
      <main className="p-6">
        <ul className="space-y-2">
          {questions.map((question) => (
            <li key={question.id}>
              <Link
                href={`/quiz/${encodeURIComponent(
                  qualification
                )}/${encodeURIComponent(year)}/${encodeURIComponent(
                  category
                )}/${question.id}`}
                className="block p-4 bg-white rounded shadow hover:bg-blue-50"
              >
                <span>
                  {`問題${question.id} ${question.question.text}` ||
                    "（テキストなし）"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default QuestionsPage;
