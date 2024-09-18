"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { MediaContent, QuestionData, QuestionOption } from "@/@types/quizType";

interface Params {
  qualification: string;
  year: string;
  id: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const EditQuestion = ({ params }: { params: Params }) => {
  const { qualification, year, id } = params;
  const { data: questionData, error } = useSWR<QuestionData>(
    `/api/questions/${encodeURIComponent(qualification)}/${encodeURIComponent(
      year
    )}/${id}`,
    fetcher
  );
  const [formData, setFormData] = useState<QuestionData | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (questionData) {
      setFormData(questionData);
    }
  }, [questionData]);

  if (error) return <div>エラーが発生しました。</div>;
  if (!formData) return <div>読み込み中...</div>;

  // 画像ファイルをBase64エンコードしてセット
  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "question" | "option",
    index?: number,
    subField?: "image" | "explanationImage"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          if (field === "question") {
            setFormData({
              ...formData!,
              question: {
                ...formData!.question,
                image: reader.result.toString(),
              },
            });
          } else if (field === "option" && index !== undefined) {
            const newOptions = [...formData!.options];
            if (subField === "image") {
              newOptions[index].image = reader.result.toString();
            } else if (subField === "explanationImage") {
              if (!newOptions[index].explanation) {
                newOptions[index].explanation = {};
              }
              newOptions[index].explanation!.image = reader.result.toString();
            }
            setFormData({ ...formData!, options: newOptions });
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field?: "question" | "option",
    index?: number,
    subField?: "explanation"
  ) => {
    const { name, value } = e.target;
    if (field === "question") {
      setFormData({
        ...formData!,
        question: {
          ...formData!.question,
          [name]: value,
        },
      });
    } else if (field === "option" && index !== undefined) {
      const newOptions = [...formData!.options];
      if (subField === "explanation") {
        if (!newOptions[index].explanation) {
          newOptions[index].explanation = {};
        }
        newOptions[index].explanation![name as keyof MediaContent] = value;
      } else {
        newOptions[index][name as keyof QuestionOption] = value;
      }
      setFormData({ ...formData!, options: newOptions });
    }
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
        {/* 問題文 */}
        <div>
          <label className="block font-medium">問題文:</label>
          <textarea
            name="text"
            value={formData.question.text || ""}
            onChange={(e) => handleChange(e, "question")}
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>
        {/* 問題画像 */}
        <div>
          <label className="block font-medium">問題画像:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, "question")}
            className="w-full"
          />
          {formData.question.image && (
            <Image
              src={formData.question.image}
              alt="問題画像"
              className="mt-2"
              width={600}
              height={400}
              unoptimized
            />
          )}
        </div>
        {/* カテゴリー */}
        <div>
          <label className="block font-medium">カテゴリー:</label>
          <input
            name="category"
            value={formData.category}
            onChange={(e) => handleChange(e, undefined, undefined)}
            className="w-full p-2 border rounded"
          />
        </div>
        {/* 選択肢と解説 */}
        <div>
          <label className="block font-medium">選択肢と解説:</label>
          {formData.options.map((option, index) => (
            <div key={index} className="mb-6 border p-4 rounded">
              <div className="mb-2">
                <label className="block font-medium">選択肢 {index + 1}:</label>
                <input
                  name="text"
                  value={option.text}
                  onChange={(e) => handleChange(e, "option", index)}
                  className="w-full p-2 border rounded mb-2"
                />
                <label className="block font-medium">選択肢画像:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageChange(e, "option", index, "image")
                  }
                  className="w-full"
                />
                {option.image && (
                  <Image
                    src={option.image}
                    alt={`選択肢${index + 1}の画像`}
                    className="mt-2"
                    width={600}
                    height={400}
                    unoptimized
                  />
                )}
              </div>
              <div>
                <label className="block font-medium">解説:</label>
                <textarea
                  name="text"
                  value={option.explanation?.text || ""}
                  onChange={(e) =>
                    handleChange(e, "option", index, "explanation")
                  }
                  className="w-full p-2 border rounded mb-2"
                  rows={2}
                />
                <label className="block font-medium">解説画像:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageChange(e, "option", index, "explanationImage")
                  }
                  className="w-full"
                />
                {option.explanation?.image && (
                  <Image
                    src={option.explanation.image}
                    alt="解説画像"
                    className="mt-2"
                    width={600}
                    height={400}
                    unoptimized
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        {/* 正解 */}
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
