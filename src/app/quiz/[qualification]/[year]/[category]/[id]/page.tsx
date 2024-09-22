import React from "react";
import Question from "../../../../../../components/Question";
import {
  getQuestions,
  getQuestionsByCategory,
} from "../../../../../../lib/questions";
import { ALL_CATEGORY } from "@/lib/constants";

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
  const question = questions.find((question) => question.id === questionId);
  const questionIdAnswers = questions.map((question) => ({
    id: question.id,
    answer: question.answer,
  }));

  return (
    <div className="min-h-screen bg-gray-100">
      <Question
        qualification={qualification}
        year={year}
        category={category}
        questionId={questionId}
        question={question || null}
        questionIdAnswers={questionIdAnswers}
      />
    </div>
  );
};

export default QuestionPage;
