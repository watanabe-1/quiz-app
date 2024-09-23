import React from "react";
import {
  getQuestions,
  getQuestionsByCategory,
} from "../../../../../lib/questions";
import { ALL_CATEGORY, nonLinkableSegmentsByQuiz } from "@/lib/constants";
import Questions from "@/components/Questions";
import Header from "@/components/ui/Header";
import Breadcrumb from "@/components/ui/Breadcrumb";

interface Params {
  qualification: string;
  year: string;
  category: string;
}

const QuestionsPage = async ({ params }: { params: Params }) => {
  const qualification = decodeURIComponent(params.qualification);
  const year = decodeURIComponent(params.year);
  const category = decodeURIComponent(params.category);
  const questions =
    category === ALL_CATEGORY
      ? await getQuestions(qualification, year)
      : await getQuestionsByCategory(qualification, year, category);

  return (
    <div>
      <Header
        title={`${qualification} - ${year} - ${
          category === ALL_CATEGORY ? "全ての問題" : category
        } の問題`}
      />
      <main className="pt-3 pr-6 pl-6">
        <Breadcrumb nonLinkableSegments={nonLinkableSegmentsByQuiz} />
        <div className="mt-3">
          <Questions
            qualification={qualification}
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
