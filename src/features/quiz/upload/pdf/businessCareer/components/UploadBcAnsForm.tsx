"use client";

import FileBox from "@/components/ui/FileBox";
import FormContainer from "@/components/ui/FormContainer";
import { useUploadBcAnsForm } from "@/features/quiz/upload/pdf/businessCareer/hooks/useUploadBcAnsForm";

const UploadBcAnsForm = () => {
  const { submitAction, loading, form, fields } = useUploadBcAnsForm();

  return (
    <FormContainer formMetadata={form} submitAction={submitAction}>
      <FileBox accept="application/pdf" fieldMetadata={fields.file} />
      <button
        type="submit"
        className="rounded bg-blue-500 px-4 py-2 text-white"
        disabled={loading}
      >
        アップロードして更新
      </button>
    </FormContainer>
  );
};

export default UploadBcAnsForm;
