"use client";

import { FieldName, getFormProps } from "@conform-to/react";
import React from "react";
import CheckBox from "@/components/ui/CheckBox";
import ErrorMessage from "@/components/ui/ErrorMessage";
import FileBox from "@/components/ui/FileBox";
import InputBox from "@/components/ui/InputBox";
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
      }
    }
  };

  return (
    <div>
      <form {...getFormProps(form)} action={submitAction} className="space-y-4">
        <ErrorMessage errors={form.errors} />
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
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          disabled={loading}
        >
          アップロード
        </button>
      </form>
    </div>
  );
};

export default UploadQuizForm;
