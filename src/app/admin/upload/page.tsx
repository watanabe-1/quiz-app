"use client";

import React, { useState } from "react";

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("ファイルを選択してください。");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("ファイルをアップロードしました。");
    } else {
      alert("アップロードに失敗しました。");
    }
  };

  return (
    <div>
      <h1>問題データのアップロード</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".json"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button type="submit">アップロード</button>
      </form>
    </div>
  );
};

export default UploadPage;
