"use client";

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
      <h2 className="text-xl font-semibold mb-4">{questionData.question}</h2>
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
            <div>{option.text}</div>
            {selectedOption === index && (
              <div className="mt-2 text-sm text-gray-700">
                <strong>解説:</strong> {option.explanation}
              </div>
            )}
          </li>
        ))}
      </ul>
      {/* 全体の解説を表示する場合 */}
      {selectedOption !== null && questionData.explanation && (
        <div className="mt-6 p-4 bg-yellow-100 rounded">
          <h3 className="font-semibold">全体の解説</h3>
          <p>{questionData.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default Question;
