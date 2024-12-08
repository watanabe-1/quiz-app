"use client";

import FileBox from "@/components/ui/FileBox";
import FormContainer from "@/components/ui/FormContainer";
import SubmitButton from "@/components/ui/SubmitButton";
import { useUploadBcAnsForm } from "@/features/quiz/upload/pdf/businessCareer/hooks/useUploadBcAnsForm";

const UploadBcAnsForm = () => {
  const { submitAction, loading, form, fields } = useUploadBcAnsForm();

  return (
    <FormContainer formMetadata={form} submitAction={submitAction}>
      <FileBox accept="application/pdf" fieldMetadata={fields.file} />
      <SubmitButton loading={loading} text="アップロードして更新" />
    </FormContainer>
  );
};

export default UploadBcAnsForm;
