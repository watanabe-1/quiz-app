"use client";

import { QuestionData } from "@/@types/quizType";
import {
  deleteHistoryByQualificationAndYear,
  getHistoryByQualificationAndYear,
} from "@/lib/localStorage";
import { isEmptyObject } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Modal from "@/components/ui/Modal";

interface QuestionsProps {
  qualification: string;
  grade: string;
  year: string;
  category: string;
  questions: QuestionData[];
}

const Questions: React.FC<QuestionsProps> = ({
  qualification,
  grade,
  year,
  category,
  questions,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(
    null
  );
  const router = useRouter();

  const navigateToQuestionPage = (questionId: number) => {
    const href = `/quiz/${encodeURIComponent(
      qualification
    )}/${encodeURIComponent(grade)}/${encodeURIComponent(
      year
    )}/${encodeURIComponent(category)}/${questionId}`;

    router.push(href);
  };

  const handleQuestionClick = (questionId: number) => {
    if (
      isEmptyObject(
        getHistoryByQualificationAndYear(qualification, grade, year)
      )
    ) {
      navigateToQuestionPage(questionId);
    } else {
      setSelectedQuestionId(questionId);
      setModalOpen(true);
    }
  };

  const handleModalSelection = (clearHistory: boolean) => {
    if (clearHistory) {
      deleteHistoryByQualificationAndYear(qualification, grade, year);
    }
    setModalOpen(false);
    navigateToQuestionPage(selectedQuestionId || 1);
  };

  return (
    <div>
      <ul className="space-y-2">
        {questions.map((question) => (
          <li key={question.questionId}>
            <a
              onClick={() => handleQuestionClick(question.questionId)}
              className="block p-4 bg-white rounded shadow hover:bg-blue-50"
            >
              <span>
                {`問題${question.questionId} ${question.question.text}` ||
                  "（テキストなし）"}
              </span>
            </a>
          </li>
        ))}
      </ul>

      {
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          showCloseButton={false}
        >
          <div>
            <p>
              {`この年度の解答履歴をすべて消して問題${selectedQuestionId}から開始するか、引き継いで開始するか選んでください。`}
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
        </Modal>
      }
    </div>
  );
};

export default Questions;
