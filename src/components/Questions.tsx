"use client";

import { QuestionData } from "@/@types/quizType";
import {
  deleteHistoryByQualificationAndYear,
  getAnswerHistory,
} from "@/lib/localStorage";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface QuestionsProps {
  qualification: string;
  year: string;
  category: string;
  questions: QuestionData[];
}

const Questions: React.FC<QuestionsProps> = ({
  qualification,
  year,
  category,
  questions,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const router = useRouter();

  const openModal = (questionId: number) => {
    setSelectedQuestion(questionId);
    setModalOpen(true);
  };

  const handleNavigate = (clearHistory: boolean) => {
    if (clearHistory) {
      deleteHistoryByQualificationAndYear(qualification, year);
    }
    const href = `/quiz/${encodeURIComponent(
      qualification
    )}/${encodeURIComponent(year)}/${encodeURIComponent(
      category
    )}/${selectedQuestion}`;
    setModalOpen(false);

    router.push(href);
  };

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
              <a
                onClick={() => openModal(question.id)}
                className="block p-4 bg-white rounded shadow hover:bg-blue-50"
              >
                <span>
                  {`問題${question.id} ${question.question.text}` ||
                    "（テキストなし）"}
                </span>
              </a>
            </li>
          ))}
        </ul>

        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow">
              <p>
                この年度の解答履歴をすべて消して開始するか、引き継いで開始するか選んでください。
              </p>
              <div className="mt-4 space-x-2">
                <button
                  onClick={() => handleNavigate(true)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  この年度の解答履歴をすべて消す
                </button>
                <button
                  onClick={() => handleNavigate(false)}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  解答履歴を引き継ぐ
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Questions;
