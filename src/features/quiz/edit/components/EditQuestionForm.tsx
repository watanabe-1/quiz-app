"use client";

import { getFormProps } from "@conform-to/react";
import React from "react";
import ErrorMessage from "@/components/ui/ErrorMessage";
import ImageBox from "@/components/ui/ImgaeBox";
import NumberBox from "@/components/ui/NumberBox";
import TextArea from "@/components/ui/TextArea";
import TextBox from "@/components/ui/TextBox";
import { useQuizForm } from "@/features/quiz/edit/hooks/useQuizForm";
import { QuestionData } from "@/types/quizType";

type EditQuestionFormParams = {
  questionData: QuestionData;
};

const EditQuestionForm: React.FC<EditQuestionFormParams> = ({
  questionData,
}) => {
  const { submitAction, loading, form, fields } = useQuizForm({
    defaultValues: questionData,
  });

  return (
    <div>
      <form {...getFormProps(form)} action={submitAction} className="space-y-4">
        <ErrorMessage errors={form.errors} />
        {/* 問題文 */}
        <TextArea
          label="問題文:"
          rows={4}
          fieldMetadata={fields.question.getFieldset().text}
        />
        {/* 問題画像 */}
        <ImageBox
          label="問題画像:"
          fieldMetadata={fields.question.getFieldset().imageFile}
          formMetadata={form}
        />
        {/* カテゴリー */}
        <TextBox label="カテゴリー:" fieldMetadata={fields.category} />
        {/* 選択肢と解説 */}
        <div>
          <label className="block font-medium">選択肢と解説:</label>
          {fields.options.getFieldList().map((option, index) => {
            const optionField = option.getFieldset();
            const explanationField = optionField.explanation.getFieldset();

            return (
              <div key={option.key} className="mb-6 rounded border p-4">
                <div className="mb-2">
                  <TextBox
                    label={`選択肢 ${index + 1}:`}
                    fieldMetadata={optionField.text}
                  />
                  <ImageBox
                    label="選択肢画像:"
                    fieldMetadata={optionField.imageFile}
                    formMetadata={form}
                  />
                </div>
                <div>
                  <TextArea
                    label="解説:"
                    rows={4}
                    fieldMetadata={explanationField.text}
                  />
                  <ImageBox
                    label="解説画像:"
                    fieldMetadata={explanationField.imageFile}
                    formMetadata={form}
                  />
                </div>
              </div>
            );
          })}
        </div>
        {/* 正解 */}
        <NumberBox
          label="正解のインデックス（0から）:"
          fieldMetadata={fields.answer}
        />
        {/* hidden */}
        <TextBox label="資格:" fieldMetadata={fields.qualification} hidden />
        <NumberBox label="ID:" fieldMetadata={fields.questionId} hidden />
        <TextBox label="級:" fieldMetadata={fields.grade} hidden />
        <TextBox label="年:" fieldMetadata={fields.year} hidden />
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          disabled={loading}
        >
          更新
        </button>
      </form>
    </div>
  );
};

export default EditQuestionForm;
