"use client";

import { useRef, useState } from "react";

const BccExamUploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileAnInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    handleSubmitBase(e, "/api/bccexamupload");
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    handleSubmitBase(e, "/api/bccexamansupload");
  };

  const handleSubmitBase = async (e: React.FormEvent, url: string) => {
    e.preventDefault();

    if (!file) return;

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await fetch(url, {
        method: "POST",
        body: formData,
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
        <h1 className="text-2xl mb-4">PDFから問題データを抽出</h1>
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
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            アップロードして登録
          </button>
        </form>
      </div>
      <div className="p-8">
        <h1 className="text-2xl mb-4">PDFから解答データを抽出</h1>
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
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            アップロードして更新
          </button>
        </form>
      </div>
    </div>
  );
};

export default BccExamUploadPage;
