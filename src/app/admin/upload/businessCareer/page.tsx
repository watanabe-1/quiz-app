"use client";

import { useRef, useState } from "react";
import { UploadBccExamSubmit } from "@/features/businessCareer/types/bcTypes";
import {
  path_api_admin_upload_businessCareer_ans,
  path_api_admin_upload_businessCareer_exam,
} from "@/lib/path";
import { createFormDataProxy } from "@/lib/proxies/createFormDataProxy";

const BccExamUploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileAnInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    handleSubmitBase(
      e,
      path_api_admin_upload_businessCareer_exam().$url().path,
    );
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    handleSubmitBase(e, path_api_admin_upload_businessCareer_ans().$url().path);
  };

  const handleSubmitBase = async (e: React.FormEvent, url: string) => {
    e.preventDefault();

    if (!file) return;

    const formDataProxy = createFormDataProxy<UploadBccExamSubmit>();
    formDataProxy.pdf = file;

    try {
      const res = await fetch(url, {
        method: "POST",
        body: formDataProxy.getFormData(),
      });

      if (!res.ok) {
        throw new Error("ファイルのアップロードに失敗しました");
      }

      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error(error);
      alert("アップロード中にエラーが発生しました");
    }

    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // ファイル入力フィールドをクリア
    }
    if (fileAnInputRef.current) {
      fileAnInputRef.current.value = ""; // ファイル入力フィールドをクリア
    }
  };

  return (
    <div>
      <div className="p-8">
        <h1 className="mb-4 text-2xl">PDFから問題データを抽出</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              if (e.target.files) {
                setFile(e.target.files[0]);
              }
            }}
            className="mb-4"
            ref={fileInputRef}
          />
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-white"
          >
            アップロードして登録
          </button>
        </form>
      </div>
      <div className="p-8">
        <h1 className="mb-4 text-2xl">PDFから解答データを抽出</h1>
        <form onSubmit={handleSubmitAnswer}>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              if (e.target.files) {
                setFile(e.target.files[0]);
              }
            }}
            className="mb-4"
            ref={fileAnInputRef}
          />
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-white"
          >
            アップロードして更新
          </button>
        </form>
      </div>
    </div>
  );
};

export default BccExamUploadPage;
