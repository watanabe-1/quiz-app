import React from "react";
import {
  getQuestions,
  getQuestionsByCategory,
} from "../../../../../lib/questions";
import { ALL_CATEGORY } from "@/lib/constants";
import Questions from "@/components/Questions";

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
    <Questions
      qualification={qualification}
      year={year}
      category={category}
      questions={questions}
    />
  );
};

export default QuestionsPage;
