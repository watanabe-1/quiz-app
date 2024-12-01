"use client";

import { getFormProps } from "@conform-to/react";
import ErrorMessage from "@/components/ui/ErrorMessage";
import FileBox from "@/components/ui/FileBox";
import { useUploadBcExamForm } from "@/features/quiz/upload/pdf/businessCareer/hooks/useUploadBcExamForm";

const UploadBcExamForm = () => {
  const { submitAction, loading, form, fields } = useUploadBcExamForm();

  return (
    <form {...getFormProps(form)} action={submitAction} className="space-y-4">
      <ErrorMessage errors={form.errors} />
      <FileBox accept="application/pdf" fieldMetadata={fields.file} />
      <button
        type="submit"
        className="rounded bg-blue-500 px-4 py-2 text-white"
        disabled={loading}
      >
        アップロードして登録
      </button>
    </form>
  );
};

export default UploadBcExamForm;
