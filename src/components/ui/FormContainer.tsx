import { getFormProps } from "@conform-to/react";
import React from "react";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { ConformProps, OptionalFieldMetadata } from "@/types/conform";

type FormContainerProps = Omit<ConformProps<unknown>, OptionalFieldMetadata> & {
  submitAction: (payload: FormData) => void;
  children: React.ReactNode;
  errorPosition?: "top" | "bottom";
};

const FormContainer = ({
  formMetadata,
  submitAction,
  children,
  errorPosition = "top",
}: FormContainerProps) => {
  const formProps = getFormProps(formMetadata);

  return (
    <form {...formProps} action={submitAction} className="space-y-4">
      {errorPosition === "top" && <ErrorMessage errors={formMetadata.errors} />}
      {children}
      {errorPosition === "bottom" && (
        <ErrorMessage errors={formMetadata.errors} />
      )}
    </form>
  );
};

export default FormContainer;
