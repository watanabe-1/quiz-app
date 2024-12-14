"use client";

import { FieldName } from "@conform-to/react";
import React from "react";
import CheckBox from "@/components/ui/CheckBox";
import FileBox from "@/components/ui/FileBox";
import FormContainer from "@/components/ui/FormContainer";
import InputBox from "@/components/ui/InputBox";
import SubmitButton from "@/components/ui/SubmitButton";
import { useUploadQuizForm } from "@/features/quiz/upload/json/hooks/useUploadQuizForm";
import { parseFileName } from "@/features/quiz/upload/json/lib/parseFileName";

const UploadQuizForm: React.FC = () => {
  const { submitAction, loading, form, fields } = useUploadQuizForm();

  const autoFile = !!fields.autoFill.value;
  const qualificationName = fields.qualification.name;
  const gradeName = fields.grade.name;
  const yearName = fields.year.name;

  const handleFileChange = (file: File | null) => {
    if (autoFile && file && file instanceof File) {
      const parsedFileName = parseFileName(file);

      if (parsedFileName) {
        form.update({
          name: qualificationName as FieldName<string>,
          value: parsedFileName.qualification,
        });
        form.update({
          name: gradeName as FieldName<string>,
          value: parsedFileName.grade,
        });
        form.update({
          name: yearName as FieldName<string>,
          value: parsedFileName.year,
        });
        form.validate();
      }
    }
  };

  return (
    <div>
      <FormContainer formMetadata={form} submitAction={submitAction}>
        <div>
          <InputBox
            label="資格名"
            fieldMetadata={fields.qualification}
            disabled={autoFile}
          />
        </div>
        <div>
          <InputBox
            label="級"
            fieldMetadata={fields.grade}
            disabled={autoFile}
          />
        </div>
        <div>
          <InputBox
            label="年度"
            fieldMetadata={fields.year}
            disabled={autoFile}
          />
        </div>
        <div>
          <FileBox
            label="JSONファイル"
            accept=".json"
            fieldMetadata={fields.file}
            onChange={(e) => {
              handleFileChange(e.target.files?.[0] || null);
            }}
          />
        </div>
        <div className="flex items-center">
          <CheckBox
            label="ファイル名から資格名、級、年度を自動入力する"
            fieldMetadata={fields.autoFill}
          />
        </div>
        <SubmitButton loading={loading} text="アップロード" />
      </FormContainer>
    </div>
  );
};

export default UploadQuizForm;
