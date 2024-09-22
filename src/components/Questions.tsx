"use client";

import { QuestionData } from "@/@types/quizType";
import {
  deleteHistoryByQualificationAndYear,
  getHistoryByQualificationAndYear,
} from "@/lib/localStorage";
import { isEmptyObject } from "@/lib/utils";
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

  const navigateToQuestionPage = (questionId: number) => {
    const href = `/quiz/${encodeURIComponent(
      qualification
    )}/${encodeURIComponent(year)}/${encodeURIComponent(
      category
    )}/${questionId}`;

    router.push(href);
  };

  const handleQuestionClick = (questionId: number) => {
    if (isEmptyObject(getHistoryByQualificationAndYear(qualification, year))) {
      navigateToQuestionPage(questionId);
    } else {
      setSelectedQuestion(questionId);
      setModalOpen(true);
    }
  };

  const handleModalSelection = (clearHistory: boolean) => {
    if (clearHistory) {
      deleteHistoryByQualificationAndYear(qualification, year);
    }
    setModalOpen(false);
    navigateToQuestionPage(selectedQuestion || 1);
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
                onClick={() => handleQuestionClick(question.id)}
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
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => handleModalSelection(true)}
                  className="bg-red-500 text-white px-4 py-2 rounded w-full"
                >
                  この年度の解答履歴をすべて消す
                </button>
                <button
                  onClick={() => handleModalSelection(false)}
                  className="bg-green-500 text-white px-4 py-2 rounded w-full"
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
