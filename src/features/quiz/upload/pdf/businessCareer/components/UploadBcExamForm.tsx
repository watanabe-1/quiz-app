"use client";

import FileBox from "@/components/ui/FileBox";
import FormContainer from "@/components/ui/FormContainer";
import { useUploadBcExamForm } from "@/features/quiz/upload/pdf/businessCareer/hooks/useUploadBcExamForm";

const UploadBcExamForm = () => {
  const { submitAction, loading, form, fields } = useUploadBcExamForm();

  return (
    <FormContainer formMetadata={form} submitAction={submitAction}>
      <FileBox accept="application/pdf" fieldMetadata={fields.file} />
      <button
        type="submit"
        className="rounded bg-blue-500 px-4 py-2 text-white"
        disabled={loading}
      >
        アップロードして登録
      </button>
    </FormContainer>
  );
};

export default UploadBcExamForm;
