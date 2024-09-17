import React from "react";
import Question from "../../components/Question";

interface Params {
  id: string;
}

const QuestionPage = ({ params }: { params: Params }) => {
  const questionId = parseInt(params.id);

  return (
    <div className="min-h-screen bg-gray-100">
      <Question questionId={questionId} />
    </div>
  );
};

export default QuestionPage;
