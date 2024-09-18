"use client";

import Image from "next/image";
import { QuestionData } from "@/@types/quizType";
import React, { useState, useEffect } from "react";
import useSWR from "swr";

interface QuestionProps {
  qualification: string;
  year: string;
  questionId: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Question: React.FC<QuestionProps> = ({
  qualification,
  year,
  questionId,
}) => {
  const { data: questionData, error } = useSWR<QuestionData>(
    `/api/questions/${encodeURIComponent(qualification)}/${encodeURIComponent(
      year
    )}/${questionId}`,
    fetcher
  );

  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    if (questionData) {
      const history = JSON.parse(localStorage.getItem("answerHistory") || "{}");
      const key = `${qualification}-${year}-${questionData.id}`;
      if (history[key] !== undefined) {
        setSelectedOption(history[key]);
      }
    }
  }, [qualification, year, questionData]);

  const handleOptionClick = (index: number) => {
    setSelectedOption(index);

    const history = JSON.parse(localStorage.getItem("answerHistory") || "{}");
    const key = `${qualification}-${year}-${questionData!.id}`;
    history[key] = index;
    localStorage.setItem("answerHistory", JSON.stringify(history));
  };

  if (error) return <div>エラーが発生しました。</div>;
  if (!questionData) return <div>読み込み中...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-6">
      {/* 問題文の表示 */}
      <div className="mb-4">
        {questionData.question.text && (
          <h2 className="text-xl font-semibold mb-2">
            {questionData.question.text}
          </h2>
        )}
        {questionData.question.image && (
          <Image
            src={questionData.question.image}
            alt="問題画像"
            className="mb-2"
            width={600}
            height={400}
            unoptimized
          />
        )}
      </div>
      {/* 選択肢の表示 */}
      <ul className="space-y-2">
        {questionData.options.map((option, index) => (
          <li
            key={index}
            onClick={() => handleOptionClick(index)}
            className={`p-4 border rounded cursor-pointer ${
              selectedOption !== null
                ? index === questionData.answer
                  ? "bg-green-200"
                  : index === selectedOption
                  ? "bg-red-200"
                  : ""
                : "hover:bg-gray-100"
            }`}
          >
            <div>
              {option.text && <div>{option.text}</div>}
              {option.image && (
                <Image
                  src={option.image}
                  alt={`選択肢${index + 1}の画像`}
                  width={600}
                  height={400}
                  unoptimized
                />
              )}
            </div>
            {/* 選択された選択肢の解説を表示 */}
            {selectedOption === index && option.explanation && (
              <div className="mt-2 text-sm text-gray-700">
                {option.explanation.text && (
                  <div>
                    <strong>解説:</strong> {option.explanation.text}
                  </div>
                )}
                {option.explanation.image && (
                  <Image
                    src={option.explanation.image}
                    alt={`解説画像`}
                    className="mt-2"
                    width={600}
                    height={400}
                    unoptimized
                  />
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Question;
