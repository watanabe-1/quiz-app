import React from "react";
import Question from "@/components/quiz/Question";
import { getQuestions, getQuestionsByCategory } from "@/services/quizService";
import { ALL_CATEGORY, nonLinkableSegmentsByQuiz } from "@/lib/constants";
import Header from "@/components/layout/Header";
import Breadcrumb from "@/components/ui/Breadcrumb";

interface Params {
  qualification: string;
  year: string;
  category: string;
  id: string;
}

const QuestionPage = async ({ params }: { params: Params }) => {
  const qualification = decodeURIComponent(params.qualification);
  const year = decodeURIComponent(params.year);
  const category = decodeURIComponent(params.category);
  const questionId = parseInt(params.id);

  // カテゴリー内の全ての問題を取得
  const questions =
    category === ALL_CATEGORY
      ? await getQuestions(qualification, year)
      : await getQuestionsByCategory(qualification, year, category);
  const question = questions.find(
    (question) => question.questionId === questionId
  );
  const questionIdAnswers = questions.map((question) => ({
    questionId: question.questionId,
    answer: question.answer,
  }));

  return (
    <div>
      <Header
        title={`${qualification} - ${year} - ${
          category === ALL_CATEGORY ? "全ての問題" : category
        } `}
      />
      <main>
        <div className="pt-3 pr-6 pl-6">
          <Breadcrumb nonLinkableSegments={nonLinkableSegmentsByQuiz} />
        </div>
        <div className="mt-3">
          <Question
            qualification={qualification}
            year={year}
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
