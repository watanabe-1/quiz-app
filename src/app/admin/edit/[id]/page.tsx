"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";

interface Params {
  id: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const EditQuestion = ({ params }: { params: Params }) => {
  const { id } = params;
  const { data: questionData, error } = useSWR(`/api/questions/${id}`, fetcher);
  const [formData, setFormData] = useState(questionData);
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
    setFormData({ ...formData, [name]: value });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/questions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      alert("問題を更新しました。");
      router.push("/admin");
    } else {
      alert("エラーが発生しました。");
    }
  };

  return (
    <div>
      <h1>問題の編集</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>問題文:</label>
          <input
            name="question"
            value={formData.question}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>カテゴリー:</label>
          <input
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>選択肢:</label>
          {formData.options.map((option: string, index: number) => (
            <input
              key={index}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
            />
          ))}
        </div>
        <div>
          <label>正解のインデックス（0から）:</label>
          <input
            name="answer"
            type="number"
            value={formData.answer}
            onChange={(e) =>
              setFormData({ ...formData, answer: parseInt(e.target.value) })
            }
          />
        </div>
        <div>
          <label>解説:</label>
          <textarea
            name="explanation"
            value={formData.explanation}
            onChange={handleChange}
          />
        </div>
        <button type="submit">更新</button>
      </form>
    </div>
  );
};

export default EditQuestion;
