import React from "react";
import Question from "../../../../../../components/Question";
import { getQuestionsByCategory } from "../../../../../../lib/questions";

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
  const questions = await getQuestionsByCategory(qualification, year, category);
  const questionIds = questions.map((q) => q.id);

  return (
    <div className="min-h-screen bg-gray-100">
      <Question
        qualification={qualification}
        year={year}
        category={category}
        questionId={questionId}
        questionIds={questionIds}
      />
    </div>
  );
};

export default QuestionPage;
