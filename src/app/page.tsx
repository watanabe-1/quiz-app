import React from "react";
import Link from "next/link";
import { getAllQualifications } from "../lib/questions";

const HomePage = async () => {
  const qualifications = await getAllQualifications();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">クイズアプリへようこそ</h1>
      </header>
      <main className="p-6">
        <h2 className="text-xl font-semibold mb-4">資格を選択してください</h2>
        <ul className="space-y-2">
          {qualifications.map((qualification) => (
            <li key={qualification}>
              <Link
                href={`/quiz/${encodeURIComponent(qualification)}`}
                className="block p-4 bg-white rounded shadow hover:bg-blue-50"
              >
                {qualification}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default HomePage;
