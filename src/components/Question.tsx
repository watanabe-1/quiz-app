"use client";

import React, { useState, useEffect } from "react";
import useSWR from "swr";

interface QuestionProps {
  qualification: string;
  year: string;
  questionId: number;
}

interface QuestionData {
  id: number;
  category: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
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
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (questionData) {
      const history = JSON.parse(localStorage.getItem("answerHistory") || "{}");
      const key = `${qualification}-${year}-${questionData.id}`;
      if (history[key] !== undefined) {
        setSelectedOption(history[key]);
        setShowExplanation(true);
      }
    }
  }, [qualification, year, questionData]);

  const handleOptionClick = (index: number) => {
    setSelectedOption(index);
    setShowExplanation(true);

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
            {option}
          </li>
        ))}
      </ul>
      {showExplanation && (
        <div className="mt-6 p-4 bg-yellow-100 rounded">
          <h3 className="font-semibold">解説</h3>
          <p>{questionData.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default Question;
