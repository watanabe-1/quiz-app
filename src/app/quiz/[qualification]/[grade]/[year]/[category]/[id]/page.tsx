import { Metadata } from "next";
import React from "react";
import Header from "@/components/layout/Header";
import Question from "@/components/quiz/Question";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { fetchGetQuestionsByCategory } from "@/lib/api";
import { ALL_CATEGORY, nonLinkableSegmentsByQuiz } from "@/lib/constants";

interface Params {
  qualification: string;
  grade: string;
  year: string;
  category: string;
  id: string;
}

export const metadata: Metadata = {
  title: "問題",
};

const QuestionPage = async ({ params }: { params: Params }) => {
  const qualification = decodeURIComponent(params.qualification);
  const grade = decodeURIComponent(params.grade);
  const year = decodeURIComponent(params.year);
  const category = decodeURIComponent(params.category);
  const questionId = parseInt(params.id);

  // カテゴリー内の全ての問題を取得
  const questions = await fetchGetQuestionsByCategory(
    qualification,
    grade,
    year,
    category,
  );
  const question = questions.find(
    (question) => question.questionId === questionId,
  );
  const questionIdAnswers = questions.map((question) => ({
    questionId: question.questionId,
    answer: question.answer,
  }));

  return (
    <div>
      <Header
        title={`${qualification} - ${grade} - ${year} - ${
          category === ALL_CATEGORY ? "全ての問題" : category
        } `}
      />
      <main>
        <div className="pl-6 pr-6 pt-3">
          <Breadcrumb nonLinkableSegments={nonLinkableSegmentsByQuiz} />
        </div>
        <div className="mt-3">
          <Question
            qualification={qualification}
            year={year}
            grade={grade}
            category={category}
            questionId={questionId}
            question={question || null}
            questionIdAnswers={questionIdAnswers}
          />
        </div>
      </main>
    </div>
  );
};

export default QuestionPage;
