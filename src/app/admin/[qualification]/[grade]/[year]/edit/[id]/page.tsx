"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { use, useState, useEffect } from "react";
import useSWR from "swr";
import { MediaContent, QuestionData, QuestionOption } from "@/@types/quizType";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ErrorState from "@/components/ui/ErrorState";
import LoadingState from "@/components/ui/LoadingState";
import { ALL_CATEGORY, nonLinkableSegmentsByAdmin } from "@/lib/constants";
import {
  path_admin_qualification_grade_year,
  path_api_admin_questions_qualification_grade_year_id,
  path_api_admin_uploadImage,
  path_api_questions_qualification_grade_year_category_id,
} from "@/lib/path";
import { createFormDataProxy } from "@/lib/proxies/createFormDataProxy";

export type UploadImageSubmit = {
  file: File;
  targetDir: string;
  qualification: string;
  grade: string;
  year: string;
};

type Params = Promise<{
  qualification: string;
  grade: string;
  year: string;
  id: string;
}>;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const EditQuestion = (props: { params: Params }) => {
  const params = use(props.params);
  const qualification = decodeURIComponent(params.qualification);
  const grade = decodeURIComponent(params.grade);
  const year = decodeURIComponent(params.year);
  const id = decodeURIComponent(params.id);

  const { data: questionData, error } = useSWR<QuestionData>(
    path_api_questions_qualification_grade_year_category_id(
      qualification,
      grade,
      year,
      ALL_CATEGORY,
      id,
    ).$url().path,
    fetcher,
  );
  const [formData, setFormData] = useState<QuestionData | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (questionData) {
      setFormData(questionData);
    }
  }, [questionData]);

  if (error) return <ErrorState />;
  if (!formData) return <LoadingState />;

  // 画像をアップロードしてパスを取得
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "question" | "option",
    index?: number,
    subField?: "explanationImage",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      let targetDir = "";

      if (field === "question") {
        targetDir = "questions";
      } else if (field === "option") {
        if (subField === "explanationImage") {
          targetDir = "explanations";
        } else {
          targetDir = "options";
        }
      }

      const formDataProxy = createFormDataProxy<UploadImageSubmit>();
      formDataProxy.file = file;
      formDataProxy.targetDir = targetDir;
      formDataProxy.qualification = qualification;
      formDataProxy.grade = grade;
      formDataProxy.year = year;

      const res = await fetch(path_api_admin_uploadImage().$url().path, {
        method: "POST",
        body: formDataProxy.getFormData(),
      });

      if (res.ok) {
        const data = await res.json();
        const imageUrl = data.url;

        if (field === "question") {
          setFormData({
            ...formData!,
            question: {
              ...formData!.question,
              image: imageUrl,
            },
          });
        } else if (field === "option" && index !== undefined) {
          const newOptions = [...formData!.options];
          if (subField === "explanationImage") {
            if (!newOptions[index].explanation) {
              newOptions[index].explanation = {};
            }
            newOptions[index].explanation!.image = imageUrl;
          } else {
            newOptions[index].image = imageUrl;
          }
          setFormData({ ...formData!, options: newOptions });
        }
      } else {
        alert("画像のアップロードに失敗しました。");
      }
    }
  };

  // 画像を削除してフィールドを空に設定
  const handleImageRemove = (
    field: "question" | "option",
    index?: number,
    subField?: "explanationImage",
  ) => {
    if (field === "question") {
      setFormData({
        ...formData!,
        question: {
          ...formData!.question,
          image: "",
        },
      });
    } else if (field === "option" && index !== undefined) {
      const newOptions = [...formData!.options];
      if (subField === "explanationImage") {
        if (newOptions[index].explanation) {
          newOptions[index].explanation!.image = "";
        }
      } else {
        newOptions[index].image = "";
      }
      setFormData({ ...formData!, options: newOptions });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field?: "question" | "category" | "option",
    index?: number,
    subField?: "explanation",
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
    } else if (field === "category") {
      setFormData({
        ...formData!,
        [name]: value,
      });
    } else if (field === "option" && index !== undefined) {
      const newOptions = [...formData!.options];
      if (subField === "explanation") {
        if (!newOptions[index].explanation) {
          newOptions[index].explanation = {};
        }
        const key = name as keyof MediaContent;
        if (key !== "id") {
          newOptions[index].explanation![key] = value;
        }
      } else {
        const key = name as keyof QuestionOption;
        if (key !== "id") {
          newOptions[index][key] = value;
        }
      }
      setFormData({ ...formData!, options: newOptions });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(
      path_api_admin_questions_qualification_grade_year_id(
        qualification,
        grade,
        year,
        id,
      ).$url().path,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      },
    );
    if (res.ok) {
      alert("問題を更新しました。");
      router.push(
        path_admin_qualification_grade_year(qualification, grade, year).$url()
          .path,
      );
    } else {
      alert("エラーが発生しました。");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Breadcrumb nonLinkableSegments={nonLinkableSegmentsByAdmin} />
      <h1 className="mb-4 text-2xl font-bold">問題の編集</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 問題文 */}
        <div>
          <label className="block font-medium">問題文:</label>
          <textarea
            name="text"
            value={formData.question.text || ""}
            onChange={(e) => handleChange(e, "question")}
            className="w-full rounded border p-2"
            rows={4}
          />
        </div>
        {/* 問題画像 */}
        <div>
          <label className="block font-medium">問題画像:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "question")}
            className="w-full"
          />
          {formData.question.image && (
            <div className="mt-2">
              <Image
                src={formData.question.image}
                alt="問題画像"
                layout="responsive"
                width={600}
                height={400}
                unoptimized
              />
              <button
                type="button"
                onClick={() => handleImageRemove("question")}
                className="mt-2 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                画像を削除
              </button>
            </div>
          )}
        </div>
        {/* カテゴリー */}
        <div>
          <label className="block font-medium">カテゴリー:</label>
          <input
            name="category"
            value={formData.category}
            onChange={(e) => handleChange(e, "category")}
            className="w-full rounded border p-2"
          />
        </div>
        {/* 選択肢と解説 */}
        <div>
          <label className="block font-medium">選択肢と解説:</label>
          {formData.options.map((option, index) => (
            <div key={index} className="mb-6 rounded border p-4">
              <div className="mb-2">
                <label className="block font-medium">選択肢 {index + 1}:</label>
                <input
                  name="text"
                  value={option.text}
                  onChange={(e) => handleChange(e, "option", index)}
                  className="mb-2 w-full rounded border p-2"
                />
                <label className="block font-medium">選択肢画像:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "option", index)}
                  className="w-full"
                />
                {option.image && (
                  <div className="mt-2">
                    <Image
                      src={option.image}
                      alt={`選択肢${index + 1}の画像`}
                      layout="responsive"
                      width={600}
                      height={400}
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => handleImageRemove("option", index)}
                      className="mt-2 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                    >
                      画像を削除
                    </button>
                  </div>
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
                  className="mb-2 w-full rounded border p-2"
                  rows={2}
                />
                <label className="block font-medium">解説画像:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageUpload(e, "option", index, "explanationImage")
                  }
                  className="w-full"
                />
                {option.explanation?.image && (
                  <div className="mt-2">
                    <Image
                      src={option.explanation.image}
                      alt="解説画像"
                      layout="responsive"
                      width={600}
                      height={400}
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleImageRemove("option", index, "explanationImage")
                      }
                      className="mt-2 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                    >
                      画像を削除
                    </button>
                  </div>
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
            className="w-full rounded border p-2"
          />
        </div>
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          更新
        </button>
      </form>
    </div>
  );
};

export default EditQuestion;
