"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";

interface Params {
  qualification: string;
  year: string;
  id: string;
}

interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const EditQuestion = ({ params }: { params: Params }) => {
  const { qualification, year, id } = params;
  const { data: questionData, error } = useSWR<Question>(
    `/api/questions/${encodeURIComponent(qualification)}/${encodeURIComponent(
      year
    )}/${id}`,
    fetcher
  );
  const [formData, setFormData] = useState<Question | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (questionData) {
      setFormData(questionData);
    }
  }, [questionData]);

  if (error) return <div>エラーが発生しました。</div>;
  if (!formData) return <div>読み込み中...</div>;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value } as Question);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData!.options];
    newOptions[index] = value;
    setFormData({ ...formData!, options: newOptions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(
      `/api/questions/${encodeURIComponent(qualification)}/${encodeURIComponent(
        year
      )}/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );
    if (res.ok) {
      alert("問題を更新しました。");
      router.push(
        `/admin/${encodeURIComponent(qualification)}/${encodeURIComponent(
          year
        )}`
      );
    } else {
      alert("エラーが発生しました。");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">問題の編集</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">問題文:</label>
          <textarea
            name="question"
            value={formData.question}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>
        <div>
          <label className="block font-medium">カテゴリー:</label>
          <input
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium">選択肢:</label>
          {formData.options.map((option, index) => (
            <input
              key={index}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
          ))}
        </div>
        <div>
          <label className="block font-medium">
            正解のインデックス（0から）:
          </label>
          <input
            name="answer"
            type="number"
            value={formData.answer}
            onChange={(e) =>
              setFormData({ ...formData!, answer: parseInt(e.target.value) })
            }
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium">解説:</label>
          <textarea
            name="explanation"
            value={formData.explanation}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          更新
        </button>
      </form>
    </div>
  );
};

export default EditQuestion;
