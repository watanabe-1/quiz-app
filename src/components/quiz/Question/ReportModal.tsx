import React, { FC } from "react";
import Modal from "@/components/ui/Modal";
import { AnswerHistory, QuestionAnswerPair } from "@/@types/quizType";
import Link from "next/link";
import { ALL_CATEGORY } from "@/lib/constants";
import { createAnswerHistoryKey } from "@/lib/localStorage";
import { createPath } from "@/lib/path";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  qualification: string;
  grade: string;
  year: string;
  category: string;
  questionIdAnswers: QuestionAnswerPair[];
  history: AnswerHistory;
  correctCount: number;
  answeredCount: number;
  accuracy: string;
}

const ReportModal: FC<ReportModalProps> = ({
  isOpen,
  onClose,
  qualification,
  grade,
  year,
  category,
  questionIdAnswers,
  history,
  correctCount,
  answeredCount,
  accuracy,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <h2 className="text-xl font-bold mb-4">成績レポート</h2>
        <div className="mb-4">
          <div>{`${qualification} - ${grade} - ${year} - ${
            category === ALL_CATEGORY ? "全ての問題" : category
          } `}</div>
          <div>正答率: {accuracy}%</div>
          <div>正解数: {correctCount}</div>
          <div>解答済みの問題数: {answeredCount}</div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">解答済みの問題</h3>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">問題番号</th>
                  <th className="border border-gray-300 px-4 py-2">
                    正解/不正解
                  </th>
                </tr>
              </thead>
              <tbody>
                {questionIdAnswers
                  .filter(
                    (qAnswer) =>
                      history[
                        createAnswerHistoryKey(
                          qualification,
                          grade,
                          year,
                          qAnswer.questionId
                        )
                      ] !== undefined
                  )
                  .map((qAnswer) => {
                    const isCorrect =
                      history[
                        createAnswerHistoryKey(
                          qualification,
                          grade,
                          year,
                          qAnswer.questionId
                        )
                      ] === qAnswer.answer;
                    const questionLink = createPath(
                      "quiz",
                      qualification,
                      grade,
                      year,
                      category,
                      qAnswer.questionId
                    );

                    return (
                      <tr key={qAnswer.questionId} className="text-center">
                        <td className="border border-gray-300 px-4 py-2">
                          <Link
                            href={questionLink}
                            className="text-blue-600 hover:underline"
                          >
                            問題 {qAnswer.questionId}
                          </Link>
                        </td>
                        <td
                          className={`border border-gray-300 px-4 py-2 ${
                            isCorrect ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {isCorrect ? "正解" : "不正解"}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ReportModal;
