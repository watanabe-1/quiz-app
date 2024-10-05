import React from "react";
import { getQuestions, getQuestionsByCategory } from "@/services/quizService";
import { ALL_CATEGORY, nonLinkableSegmentsByQuiz } from "@/lib/constants";
import Questions from "@/components/quiz/Questions";
import Header from "@/components/layout/Header";
import Breadcrumb from "@/components/ui/Breadcrumb";

interface Params {
  qualification: string;
  grade: string;
  year: string;
  category: string;
}

const QuestionsPage = async ({ params }: { params: Params }) => {
  const qualification = decodeURIComponent(params.qualification);
  const grade = decodeURIComponent(params.grade);
  const year = decodeURIComponent(params.year);
  const category = decodeURIComponent(params.category);
  const questions =
    category === ALL_CATEGORY
      ? await getQuestions(qualification, grade, year)
      : await getQuestionsByCategory(qualification, grade, year, category);

  return (
    <div>
      <Header
        title={`${qualification} - ${grade} - ${year} - ${
          category === ALL_CATEGORY ? "全ての問題" : category
        } の問題`}
      />
      <main className="pt-3 pr-6 pl-6">
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
