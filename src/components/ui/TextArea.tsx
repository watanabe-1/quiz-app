import { getTextareaProps } from "@conform-to/react";
import React from "react";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { ConformProps, OptionalFormMetadata } from "@/types/conform";

type TextAreaProps = Omit<ConformProps<string>, OptionalFormMetadata> & {
  label: string;
  rows: number;
  hidden?: boolean;
};

const TextArea = ({
  label,
  rows,
  fieldMetadata,
  hidden = false,
}: TextAreaProps) => {
  const inputProps = getTextareaProps(fieldMetadata);

  return (
    <div hidden={hidden}>
      <label className="mb-2 block font-medium">{label}</label>
      <textarea
        {...inputProps}
        className="w-full rounded-sm border p-2"
        rows={rows}
        key={fieldMetadata.key}
      />
      <ErrorMessage errors={fieldMetadata.errors} />
    </div>
  );
};

export default TextArea;
