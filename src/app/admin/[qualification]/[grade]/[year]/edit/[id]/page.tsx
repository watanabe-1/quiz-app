import React from "react";
import Header from "@/components/layout/Header";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ErrorMessage from "@/components/ui/ErrorMessage";
import EditQuizForm from "@/features/quiz/edit/components/EditQuizForm";
import { fetchGetQuestionsByCategory } from "@/lib/api";
import { ALL_CATEGORY, nonLinkableSegmentsByAdmin } from "@/lib/constants";

type Params = Promise<{
  qualification: string;
  grade: string;
  year: string;
  id: string;
}>;

const EditQuestion = async (props: { params: Params }) => {
  const decodedParams = await props.params;
  const qualification = decodeURIComponent(decodedParams.qualification);
  const grade = decodeURIComponent(decodedParams.grade);
  const year = decodeURIComponent(decodedParams.year);
  const questionId = parseInt(decodedParams.id);

  const questions = await fetchGetQuestionsByCategory(
    qualification,
    grade,
    year,
    ALL_CATEGORY,
  );

  const question = questions.find(
    (question) => question.questionId === questionId,
  );

  if (!question)
    return <ErrorMessage errors={["修正対象の問題を取得出来ませんでした"]} />;

  return (
    <div>
      <Header
        title={`${qualification} - ${grade} - ${year} - 問題${questionId} の管理`}
      />
      <main className="p-6">
        <Breadcrumb nonLinkableSegments={nonLinkableSegmentsByAdmin} />
        <div className="min-h-screen bg-gray-100 p-6">
          <h1 className="mb-4 text-2xl font-bold">問題の編集</h1>
          <EditQuizForm questionData={question} />
        </div>
      </main>
    </div>
  );
};

export default EditQuestion;
