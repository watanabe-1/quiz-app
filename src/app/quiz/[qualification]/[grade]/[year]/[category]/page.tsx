import { Metadata } from "next";
import React from "react";
import Header from "@/components/layout/Header";
import Questions from "@/components/quiz/Questions";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { fetchGetQuestionsByCategory } from "@/lib/api";
import { ALL_CATEGORY, nonLinkableSegmentsByQuiz } from "@/lib/constants";

interface Params {
  qualification: string;
  grade: string;
  year: string;
  category: string;
}

export const metadata: Metadata = {
  title: "問題選択",
};

const QuestionsPage = async ({ params }: { params: Params }) => {
  const qualification = decodeURIComponent(params.qualification);
  const grade = decodeURIComponent(params.grade);
  const year = decodeURIComponent(params.year);
  const category = decodeURIComponent(params.category);
  const questions = await fetchGetQuestionsByCategory(
    qualification,
    grade,
    year,
    category,
  );

  return (
    <div>
      <Header
        title={`${qualification} - ${grade} - ${year} - ${
          category === ALL_CATEGORY ? "全ての問題" : category
        } の問題`}
      />
      <main className="pl-6 pr-6 pt-3">
        <Breadcrumb nonLinkableSegments={nonLinkableSegmentsByQuiz} />
        <div className="mt-3">
          <Questions
            qualification={qualification}
            grade={grade}
            year={year}
            category={category}
            questions={questions}
          />
        </div>
      </main>
    </div>
  );
};

export default QuestionsPage;
