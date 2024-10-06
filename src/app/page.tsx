import React from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import { fetchGetAllQualifications } from "@/lib/api";

const HomePage = async () => {
  const qualifications = await fetchGetAllQualifications();

  return (
    <div>
      <Header title="クイズアプリへようこそ" />
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
