"use client";

import FileBox from "@/components/ui/FileBox";
import FormContainer from "@/components/ui/FormContainer";
import SubmitButton from "@/components/ui/SubmitButton";
import { useUploadBcExamForm } from "@/features/quiz/upload/pdf/businessCareer/hooks/useUploadBcExamForm";

const UploadBcExamForm = () => {
  const { submitAction, loading, form, fields } = useUploadBcExamForm();

  return (
    <FormContainer formMetadata={form} submitAction={submitAction}>
      <FileBox accept="application/pdf" fieldMetadata={fields.file} />
      <SubmitButton loading={loading} text="アップロードして登録" />
    </FormContainer>
  );
};

export default UploadBcExamForm;
