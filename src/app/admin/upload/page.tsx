"use client";

import React, { useState } from "react";

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [qualification, setQualification] = useState("");
  const [grade, setGrade] = useState("");
  const [year, setYear] = useState("");
  const [autoFill, setAutoFill] = useState(false); // 自動入力のチェックボックス状態

  const handleFileChange = (file: File | null) => {
    setFile(file);
    if (autoFill && file) {
      const fileName = file.name.split(".")[0]; // 拡張子を除く
      const parts = fileName.split("_");

      if (parts.length >= 3) {
        setQualification(parts[0]);
        setGrade(parts[1]);

        // parts[2]以降のすべてを結合してyearとする
        const yearPart = parts.slice(2).join("_");
        setYear(yearPart);
      } else {
        alert(
          "ファイル名の形式が正しくありません。資格名_級_年度の形式にしてください。",
        );
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !qualification || !year) {
      alert("すべてのフィールドを入力してください。");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("qualification", qualification);
    formData.append("grade", grade);
    formData.append("year", year);

    const res = await fetch("/api/admin/upload", {
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
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="mb-4 text-2xl font-bold">問題データのアップロード</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">資格名</label>
          <input
            type="text"
            value={qualification}
            onChange={(e) => setQualification(e.target.value)}
            className="w-full rounded border p-2"
            disabled={autoFill} // 自動入力がオンの時は手動入力を無効化
          />
        </div>
        <div>
          <label className="block font-medium">級</label>
          <input
            type="text"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full rounded border p-2"
            disabled={autoFill}
          />
        </div>
        <div>
          <label className="block font-medium">年度</label>
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full rounded border p-2"
            disabled={autoFill}
          />
        </div>
        <div>
          <label className="block font-medium">JSONファイル</label>
          <input
            type="file"
            accept=".json"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            className="w-full"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={autoFill}
            onChange={(e) => setAutoFill(e.target.checked)}
            className="mr-2"
          />
          <label className="font-medium">
            ファイル名から資格名、級、年度を自動入力する
          </label>
        </div>
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          アップロード
        </button>
      </form>
    </div>
  );
};

export default UploadPage;
