import Link from "next/link";
import React from "react";
import Header from "@/components/layout/Header";
import { fetchGetAllQualifications } from "@/lib/api";
import { path_quiz_qualification } from "@/lib/path";

const HomePage = async () => {
  const qualifications = await fetchGetAllQualifications();

  return (
    <div>
      <Header title="過去問テストサイトへようこそ" />
      <main className="p-6">
        <h2 className="mb-4 text-xl font-semibold">資格を選択してください</h2>
        <ul className="space-y-2">
          {qualifications.map((qualification) => (
            <li key={qualification}>
              <Link
                href={path_quiz_qualification(qualification).$url().path}
                className="block rounded bg-white p-4 shadow hover:bg-blue-50"
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
