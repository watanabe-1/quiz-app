"use client";

import { useState } from "react";

const BccExamUploadPage = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) return;

    const formData = new FormData();
    formData.append("pdf", file);

    const res = await fetch("/api/bccexamupload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log(data); // JSON化された問題データをコンソールに表示

    // 解析結果を画面に表示する場合は、別途状態管理を行ってください
  };

  return (
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
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          アップロードして解析
        </button>
      </form>
    </div>
  );
};

export default BccExamUploadPage;
