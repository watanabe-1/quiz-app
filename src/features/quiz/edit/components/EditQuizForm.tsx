"use client";

import React from "react";
import FormContainer from "@/components/ui/FormContainer";
import ImageBox from "@/components/ui/ImgaeBox";
import InputBox from "@/components/ui/InputBox";
import SubmitButton from "@/components/ui/SubmitButton";
import TextArea from "@/components/ui/TextArea";
import { useQuizForm } from "@/features/quiz/edit/hooks/useQuizForm";
import { QuestionData } from "@/types/quizType";

type EditQuizFormParams = {
  questionData: QuestionData;
};

const EditQuizForm: React.FC<EditQuizFormParams> = ({ questionData }) => {
  const { submitAction, loading, form, fields } = useQuizForm({
    defaultValues: questionData,
  });

  return (
    <div>
      <FormContainer formMetadata={form} submitAction={submitAction}>
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
        <InputBox label="カテゴリー:" fieldMetadata={fields.category} />
        {/* 選択肢と解説 */}
        <div>
          <label className="block font-medium">選択肢と解説:</label>
          {fields.options.getFieldList().map((option, index) => {
            const optionField = option.getFieldset();
            const explanationField = optionField.explanation.getFieldset();

            return (
              <div key={option.key} className="mb-6 rounded border p-4">
                <div className="mb-2">
                  <InputBox
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
        <InputBox
          type="number"
          label="正解のインデックス（0から）:"
          fieldMetadata={fields.answer}
        />
        {/* hidden */}
        <InputBox label="資格:" fieldMetadata={fields.qualification} hidden />
        <InputBox
          type="number"
          label="ID:"
          fieldMetadata={fields.questionId}
          hidden
        />
        <InputBox label="級:" fieldMetadata={fields.grade} hidden />
        <InputBox label="年:" fieldMetadata={fields.year} hidden />
        <SubmitButton loading={loading} text="更新" />
      </FormContainer>
    </div>
  );
};

export default EditQuizForm;
