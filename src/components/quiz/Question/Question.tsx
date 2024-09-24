"use client";

import Image from "next/image";
import {
  AnswerHistory,
  QuestionAnswerPair,
  QuestionData,
} from "@/@types/quizType";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  createAnswerHistoryKey,
  getAnswerHistory,
  setAnswerHistory,
} from "@/lib/localStorage";
import { calculateCorrectCount, calculateAnsweredCount } from "./quizUtils";
import AnswerOption from "./AnswerOption";
import ExplanationSection from "./ExplanationSection";
import ReportModal from "./ReportModal";

interface QuestionProps {
  qualification: string;
  year: string;
  category: string;
  questionId: number;
  question: QuestionData | null;
  questionIdAnswers: QuestionAnswerPair[];
}

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
  const [shouldScroll, setShouldScroll] = useState(false);
  const [history, setHistory] = useState<AnswerHistory>(() =>
    getAnswerHistory()
  );

  // 解説部分を参照するためのref
  const explanationRef = useRef<HTMLDivElement | null>(null);

  // 更新された履歴を反映してselectedOptionを設定
  useEffect(() => {
    if (question) {
      const key = createAnswerHistoryKey(qualification, year, question.id);
      if (history[key] !== undefined) {
        setSelectedOption(history[key]);
      } else {
        setSelectedOption(null);
      }
    }
  }, [qualification, year, question, history]);

  // 正解数と解答済みの問題数を計算
  useEffect(() => {
    if (question) {
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
  }, [questionIdAnswers, qualification, year, history, question]);

  // スクロール処理
  useEffect(() => {
    if (shouldScroll && selectedOption !== null && explanationRef.current) {
      // ヘッダーをstickyで定義しているため、スクロールがずれないようにheaderの高さ分オフセットをとるようにする
      const headerElement = document.querySelector("header");
      const headerHeight = headerElement?.clientHeight || 0;
      const elementPosition =
        explanationRef.current.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      setShouldScroll(false);
    }
  }, [shouldScroll, selectedOption]);

  if (!question) return <div>問題が取得できませんでした</div>;

  const toggleReportModal = () => {
    setIsReportOpen((prev) => !prev);
  };

  const handleOptionClick = useCallback(
    (index: number) => {
      const key = createAnswerHistoryKey(qualification, year, question.id);
      const updatedHistory = { ...history, [key]: index };
      setHistory(updatedHistory);
      setAnswerHistory(updatedHistory); // ローカルストレージも更新
      setSelectedOption(index);
      setShouldScroll(true);
    },
    [qualification, year, question, history]
  );

  // 解答リセットの処理
  const handleResetAnswer = useCallback(() => {
    const key = createAnswerHistoryKey(qualification, year, question.id);
    const { [key]: _, ...rest } = history;
    setHistory(rest);
    setAnswerHistory(rest); // ローカルストレージも更新
    setSelectedOption(null);
    setShouldScroll(false);
  }, [qualification, year, question, history]);

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
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow flex flex-col min-h-screen">
      <div className="flex-grow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between text-left text-sm text-gray-600 mb-2">
          <span>{`【前問まで】正解数 ${correctCount} / ${answeredCount} 問中 正答率 ${accuracy}%`}</span>
          <button
            onClick={toggleReportModal}
            className="mt-2 md:mt-0 border border-green-500 text-green-500 rounded px-4 py-2 hover:bg-green-500 hover:text-white transition-colors"
            aria-label="成績詳細を表示"
          >
            成績詳細
          </button>
        </div>
        <div className="text-right text-sm text-gray-600 mb-4">
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
              width={600}
              height={300}
              priority
            />
          )}
        </div>
        <ul className="space-y-2">
          {question.options.map((option, index) => (
            <AnswerOption
              key={index}
              option={option}
              index={index}
              isCorrect={index === question.answer}
              isSelected={selectedOption === index}
              isAnswered={selectedOption !== null}
              handleOptionClick={handleOptionClick}
            />
          ))}
        </ul>
      </div>

      {/* 解答リセットボタン */}
      <button
        onClick={handleResetAnswer}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        解答をリセットする
      </button>

      {/* 解説セクション */}
      {selectedOption !== null && (
        <ExplanationSection ref={explanationRef} question={question} />
      )}

      {/* ナビゲーションボタン */}
      <div className="flex justify-between mt-6">
        {prevQuestionId ? (
          <Link
            href={`/quiz/${encodeURIComponent(
              qualification
            )}/${encodeURIComponent(year)}/${encodeURIComponent(
              category
            )}/${prevQuestionId}`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
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
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            次の問題
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* モーダル: 成績レポート */}
      {isReportOpen && (
        <ReportModal
          isOpen={isReportOpen}
          onClose={toggleReportModal}
          qualification={qualification}
          year={year}
          category={category}
          questionIdAnswers={questionIdAnswers}
          history={history}
          correctCount={correctCount}
          answeredCount={answeredCount}
          accuracy={accuracy}
        />
      )}
    </div>
  );
};

export default Question;
