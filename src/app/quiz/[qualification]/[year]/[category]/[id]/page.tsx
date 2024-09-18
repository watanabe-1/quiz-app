import React from "react";
import Question from "../../../../../../components/Question";

interface Params {
  qualification: string;
  year: string;
  category: string;
  id: string;
}

const QuestionPage = ({ params }: { params: Params }) => {
  const qualification = decodeURIComponent(params.qualification);
  const year = decodeURIComponent(params.year);
  const questionId = parseInt(params.id);

  return (
    <div className="min-h-screen bg-gray-100">
      <Question
        qualification={qualification}
        year={year}
        questionId={questionId}
      />
    </div>
  );
};

export default QuestionPage;
