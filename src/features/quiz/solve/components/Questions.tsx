"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import { client } from "@/lib/client";
import {
  deleteHistoryByQualificationAndYear,
  getHistoryByQualificationAndYear,
} from "@/lib/localStorage";
import { isEmptyObject } from "@/lib/utils";
import { QuestionData } from "@/types/quizType";

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
    null,
  );
  const router = useRouter();

  const navigateToQuestionPage = (questionId: number) => {
    const href = client.quiz
      ._qualification(qualification)
      ._grade(grade)
      ._year(year)
      ._category(category)
      ._id(questionId)
      .$url().path;

    router.push(href);
  };

  const handleQuestionClick = (questionId: number) => {
    if (
      isEmptyObject(
        getHistoryByQualificationAndYear(qualification, grade, year),
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
              className="block rounded bg-white p-4 shadow hover:bg-blue-50"
            >
              <span>
                {`問題${question.questionId} ${question.question.text}`}
              </span>
            </a>
          </li>
        ))}
      </ul>

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
              className="w-full rounded bg-red-500 px-4 py-2 text-white"
            >
              この年度の解答履歴をすべて消す
            </button>
            <button
              onClick={() => handleModalSelection(false)}
              className="w-full rounded bg-green-500 px-4 py-2 text-white"
            >
              解答履歴を引き継ぐ
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Questions;
