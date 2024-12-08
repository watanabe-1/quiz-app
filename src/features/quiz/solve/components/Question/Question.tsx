"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef, useCallback } from "react";
import AnswerOption from "@/features/quiz/solve/components/Question/AnswerOption";
import ExplanationSection from "@/features/quiz/solve/components/Question/ExplanationSection";
import {
  calculateCorrectCount,
  calculateAnsweredCount,
} from "@/features/quiz/solve/components/Question/quizUtils";
import ReportModal from "@/features/quiz/solve/components/Question/ReportModal";
import {
  createAnswerHistoryKey,
  getAnswerHistory,
  setAnswerHistory,
} from "@/lib/localStorage";
import { path_quiz_Dqualification_Dgrade_Dyear_Dcategory_Did } from "@/lib/path";
import {
  AnswerHistory,
  QuestionAnswerPair,
  QuestionData,
} from "@/types/quizType";

interface QuestionProps {
  qualification: string;
  grade: string;
  year: string;
  category: string;
  questionId: number;
  question: QuestionData | null;
  questionIdAnswers: QuestionAnswerPair[];
}

const Question: React.FC<QuestionProps> = ({
  qualification,
  grade,
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
    getAnswerHistory(),
  );

  const explanationRef = useRef<HTMLDivElement | null>(null);

  // Update selectedOption based on history
  useEffect(() => {
    if (question) {
      const key = createAnswerHistoryKey(
        qualification,
        grade,
        year,
        question.questionId,
      );
      if (history[key] !== undefined) {
        setSelectedOption(history[key]);
      } else {
        setSelectedOption(null);
      }
    }
  }, [qualification, grade, year, question, history]);

  // Calculate correct and answered counts
  useEffect(() => {
    if (question) {
      const totalCorrect = calculateCorrectCount(
        questionIdAnswers,
        qualification,
        grade,
        year,
        history,
      );
      const totalAnswered = calculateAnsweredCount(
        questionIdAnswers,
        qualification,
        grade,
        year,
        history,
      );
      setCorrectCount(totalCorrect);
      setAnsweredCount(totalAnswered);
    }
  }, [questionIdAnswers, qualification, grade, year, history, question]);

  // Handle scrolling
  useEffect(() => {
    if (shouldScroll && selectedOption !== null && explanationRef.current) {
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

  const toggleReportModal = () => {
    setIsReportOpen((prev) => !prev);
  };

  const handleOptionClick = useCallback(
    (index: number) => {
      if (!question) return;
      const key = createAnswerHistoryKey(
        qualification,
        grade,
        year,
        question.questionId,
      );
      const updatedHistory = { ...history, [key]: index };
      setHistory(updatedHistory);
      setAnswerHistory(updatedHistory); // Update localStorage
      setSelectedOption(index);
      setShouldScroll(true);
    },
    [qualification, grade, year, question, history],
  );

  const handleResetAnswer = useCallback(() => {
    if (!question) return;
    const key = createAnswerHistoryKey(
      qualification,
      grade,
      year,
      question.questionId,
    );

    // Create a shallow copy and remove the specific key
    const rest = { ...history };
    delete rest[key];

    // Update state and localStorage
    setHistory(rest);
    setAnswerHistory(rest);

    // Reset selection and scrolling
    setSelectedOption(null);
    setShouldScroll(false);
  }, [qualification, grade, year, question, history]);

  if (!question) return <div>問題が取得できませんでした</div>;

  const questionIds = questionIdAnswers.map((q) => q.questionId);
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
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col rounded bg-white p-6 shadow">
      <div className="flex-grow">
        <div className="mb-2 flex flex-col text-left text-sm text-gray-600 md:flex-row md:items-center md:justify-between">
          <span>{`【前問まで】正解数 ${correctCount} / ${answeredCount} 問中 正答率 ${accuracy}%`}</span>
          <button
            onClick={toggleReportModal}
            className="mt-2 rounded border border-green-500 px-4 py-2 text-green-500 transition-colors hover:bg-green-500 hover:text-white md:mt-0"
            aria-label="成績詳細を表示"
          >
            成績詳細
          </button>
        </div>
        <div className="mb-4 text-right text-sm text-gray-600">
          {currentIndex + 1} / {questionIds.length} 問
        </div>
        <div className="mb-4">
          {question.question.text && (
            <h2 className="mb-2 text-xl font-semibold">
              {`問題${question.questionId} ${question.question.text}`}
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
        className="mt-4 rounded bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
      >
        解答をリセットする
      </button>

      {/* 解説セクション */}
      {selectedOption !== null && (
        <ExplanationSection ref={explanationRef} question={question} />
      )}

      {/* ナビゲーションボタン */}
      <div className="mt-6 flex justify-between">
        {prevQuestionId ? (
          <Link
            href={
              path_quiz_Dqualification_Dgrade_Dyear_Dcategory_Did(
                qualification,
                grade,
                year,
                category,
                prevQuestionId,
              ).$url().path
            }
            className="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            前の問題
          </Link>
        ) : (
          <div />
        )}
        {nextQuestionId ? (
          <Link
            href={
              path_quiz_Dqualification_Dgrade_Dyear_Dcategory_Did(
                qualification,
                grade,
                year,
                category,
                nextQuestionId,
              ).$url().path
            }
            className="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
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
          grade={grade}
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
