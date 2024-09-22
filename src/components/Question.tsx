"use client";

import Image from "next/image";
import { QuestionAnswerPair, QuestionData } from "@/@types/quizType";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { numberToKatakanaMap } from "@/lib/constants";
import {
  createAnswerHistoryKey,
  getAnswerHistory,
  setAnswerHistory,
} from "@/lib/localStorage";
import Modal from "@/components/ui/Modal";

interface QuestionProps {
  qualification: string;
  year: string;
  category: string;
  questionId: number;
  question: QuestionData | null;
  questionIdAnswers: QuestionAnswerPair[];
}

const calculateCorrectCount = (
  questionIdAnswers: QuestionAnswerPair[],
  qualification: string,
  year: string,
  history: { [x: string]: undefined }
): number => {
  return questionIdAnswers.reduce((count, idAnswer) => {
    const storedAnswer = history[`${qualification}-${year}-${idAnswer.id}`];
    if (storedAnswer === idAnswer?.answer) {
      return count + 1;
    }
    return count;
  }, 0);
};

const calculateAnsweredCount = (
  questionIdAnswers: QuestionAnswerPair[],
  qualification: string,
  year: string,
  history: { [x: string]: undefined }
): number => {
  return questionIdAnswers.reduce((count, idAnswer) => {
    if (history[`${qualification}-${year}-${idAnswer.id}`] !== undefined) {
      return count + 1;
    }
    return count;
  }, 0);
};

const Question: React.FC<QuestionProps> = ({
  qualification,
  year,
  category,
  questionId,
  questionIdAnswers,
  question,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // 解説部分を参照するためのref
  const explanationRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (question) {
      const history = getAnswerHistory();
      const key = createAnswerHistoryKey(qualification, year, question.id);
      if (history[key] !== undefined) {
        setSelectedOption(history[key]);
      } else {
        setSelectedOption(null);
      }

      // 正解数と解いた問題数をそれぞれ計算
      const totalCorrect = calculateCorrectCount(
        questionIdAnswers,
        qualification,
        year,
        history
      );
      const totalAnswered = calculateAnsweredCount(
        questionIdAnswers,
        qualification,
        year,
        history
      );
      setCorrectCount(totalCorrect);
      setAnsweredCount(totalAnswered);
    }
  }, [qualification, year, questionIdAnswers, question]);

  if (!question) return <div>問題が取得できませんでした</div>;

  const toggleReportModal = () => {
    setIsReportOpen(!isReportOpen);
  };

  const handleOptionClick = (index: number) => {
    const history = getAnswerHistory();
    const key = createAnswerHistoryKey(qualification, year, question.id);
    history[key] = index;

    setAnswerHistory(history);
    setSelectedOption(index);

    // 正解数と解いた問題数をそれぞれ計算
    const totalCorrect = calculateCorrectCount(
      questionIdAnswers,
      qualification,
      year,
      history
    );
    const totalAnswered = calculateAnsweredCount(
      questionIdAnswers,
      qualification,
      year,
      history
    );
    setCorrectCount(totalCorrect);
    setAnsweredCount(totalAnswered);

    // 解説が表示される位置にスクロール
    if (explanationRef.current) {
      explanationRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 解答リセットの処理
  const handleResetAnswer = () => {
    const history = getAnswerHistory();
    const key = createAnswerHistoryKey(qualification, year, question.id);
    delete history[key]; // 解答を削除
    setAnswerHistory(history);
    setSelectedOption(null); // 選択状態をリセット
    // 正解数と解答済みの問題数を再計算
    const totalCorrect = calculateCorrectCount(
      questionIdAnswers,
      qualification,
      year,
      history
    );
    const totalAnswered = calculateAnsweredCount(
      questionIdAnswers,
      qualification,
      year,
      history
    );
    setCorrectCount(totalCorrect);
    setAnsweredCount(totalAnswered);
  };

  const questionIds = questionIdAnswers.map((q) => q.id);
  const currentIndex = questionIds.indexOf(questionId);
  const prevQuestionId =
    currentIndex > 0 ? questionIds[currentIndex - 1] : null;
  const nextQuestionId =
    currentIndex < questionIds.length - 1
      ? questionIds[currentIndex + 1]
      : null;

  const accuracy =
    answeredCount > 0
      ? ((correctCount / answeredCount) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-6 flex flex-col min-h-screen">
      <div className="flex-grow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-start text-left text-sm text-gray-600 mb-2">
          {`【前問まで】正解数 ${correctCount} / ${answeredCount} 問中  正答率 ${accuracy}%`}
          <button
            onClick={toggleReportModal}
            className="md:ml-4 mt-2 md:mt-0 border border-green-500 text-green-500 rounded px-4 py-2 hover:bg-green-500 hover:text-white transition-colors"
          >
            成績詳細
          </button>
        </div>
        <div className="text-right text-sm text-gray-600">
          {currentIndex + 1} / {questionIds.length} 問
        </div>
        <div className="mb-4">
          {question.question.text && (
            <h2 className="text-xl font-semibold mb-2">
              {`問題${question.id} ${question.question.text}`}
            </h2>
          )}
          {question.question.image && (
            <Image
              src={question.question.image}
              alt="問題画像"
              className="mb-2"
              layout="responsive"
              width={600}
              height={300}
              unoptimized
            />
          )}
        </div>
        <ul className="space-y-2">
          {question.options.map((option, index) => (
            <li
              key={index}
              onClick={() => handleOptionClick(index)}
              className={`p-4 border rounded cursor-pointer ${
                selectedOption !== null
                  ? index === question.answer
                    ? "bg-green-200"
                    : index === selectedOption
                    ? "bg-red-200"
                    : ""
                  : "hover:bg-gray-100"
              }`}
            >
              <div>
                {option.text && (
                  <div>
                    {`${numberToKatakanaMap.get(index)} ${option.text}`}
                  </div>
                )}
                {option.image && (
                  <Image
                    src={option.image}
                    alt={`選択肢${numberToKatakanaMap.get(index)}の画像`}
                    layout="responsive"
                    width={300}
                    height={200}
                    unoptimized
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 解答リセットボタン */}
      <button
        onClick={handleResetAnswer}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        解答をリセットする
      </button>

      {/* 画面下部に解説と正答を表示し、スクロール対象のrefを設定 */}
      {selectedOption !== null && (
        <div ref={explanationRef} className="mt-6 p-4 border-t">
          {/* 問題の解説がある場合のみ表示 */}
          {question.explanation?.text || question.explanation?.image ? (
            <>
              <h3 className="text-lg font-semibold mb-2">問題の解説</h3>
              {question.explanation?.text && (
                <div className="mb-2">
                  <strong>説明:</strong> {question.explanation.text}
                </div>
              )}
              {question.explanation?.image && (
                <Image
                  src={question.explanation.image}
                  alt={`問題の解説画像`}
                  className="mt-2"
                  layout="responsive"
                  width={600}
                  height={400}
                  unoptimized
                />
              )}
            </>
          ) : null}

          {/* 選択肢の解説がある場合のみ表示 */}
          {question.options.some(
            (option) => option.explanation?.text || option.explanation?.image
          ) && (
            <h3 className="text-lg font-semibold mb-2 mt-4">選択肢の解説</h3>
          )}
          {question.options.map((option, index) =>
            option.explanation?.text || option.explanation?.image ? (
              <div key={index} className="mb-4">
                <strong>選択肢 {numberToKatakanaMap.get(index)}:</strong>
                {option.explanation?.text && (
                  <div className="mt-2">
                    <strong>説明:</strong> {option.explanation.text}
                  </div>
                )}
                {option.explanation?.image && (
                  <Image
                    src={option.explanation.image}
                    alt={`選択肢${numberToKatakanaMap.get(index)}の解説画像`}
                    className="mt-2"
                    layout="responsive"
                    width={600}
                    height={400}
                    unoptimized
                  />
                )}
              </div>
            ) : null
          )}

          {/* 正答の表示 */}
          <div className="mt-4">
            <strong>答え:</strong>
            {`${numberToKatakanaMap.get(question.answer)} ${
              question.options[question.answer].text
            }`}
          </div>
        </div>
      )}
      <div className="flex justify-between mt-6">
        {prevQuestionId ? (
          <Link
            href={`/quiz/${encodeURIComponent(
              qualification
            )}/${encodeURIComponent(year)}/${encodeURIComponent(
              category
            )}/${prevQuestionId}`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            前の問題
          </Link>
        ) : (
          <div />
        )}
        {nextQuestionId ? (
          <Link
            href={`/quiz/${encodeURIComponent(
              qualification
            )}/${encodeURIComponent(year)}/${encodeURIComponent(
              category
            )}/${nextQuestionId}`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            次の問題
          </Link>
        ) : (
          <div />
        )}
      </div>
      {/* Modal for performance report */}
      {isReportOpen && (
        <Modal isOpen={isReportOpen} onClose={toggleReportModal}>
          <div>
            <h2 className="text-xl font-bold mb-4">成績レポート</h2>
            <div className="mb-4">
              <div>総合成績: {accuracy}%</div>
              <div>正解数: {correctCount}</div>
              <div>解答済みの問題数: {answeredCount}</div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">解答済みの問題</h3>
                <table className="table-auto w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-300 px-4 py-2">
                        問題番号
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        正解/不正解
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {questionIdAnswers
                      .filter((qAnswer) => {
                        const history = getAnswerHistory();
                        return (
                          history[`${qualification}-${year}-${qAnswer.id}`] !==
                          undefined
                        );
                      })
                      .map((qAnswer) => {
                        const history = getAnswerHistory();
                        const isCorrect =
                          history[`${qualification}-${year}-${qAnswer.id}`] ===
                          qAnswer.answer;

                        // URLを生成するためにエンコード
                        const questionLink = `/quiz/${encodeURIComponent(
                          qualification
                        )}/${encodeURIComponent(year)}/${encodeURIComponent(
                          category
                        )}/${qAnswer.id}`;

                        return (
                          <tr key={qAnswer.id} className="text-center">
                            <td className="border border-gray-300 px-4 py-2">
                              <Link
                                href={questionLink}
                                className="text-blue-600 hover:underline"
                              >
                                問題 {qAnswer.id}
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
      )}
    </div>
  );
};

export default Question;
