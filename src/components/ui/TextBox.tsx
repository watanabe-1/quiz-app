import { getInputProps } from "@conform-to/react";
import React from "react";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { ConformProps, OptionalFormMetadata } from "@/types/conform";

type TextBoxProps = Omit<ConformProps<string>, OptionalFormMetadata> & {
  label: string;
  placeholder?: string;
  hidden?: boolean;
  disabled?: boolean;
};

const TextBox = ({
  label,
  fieldMetadata,
  placeholder = "",
  hidden = false,
  disabled = false,
}: TextBoxProps) => {
  const inputProps = getInputProps(fieldMetadata, { type: "text" });

  return (
    <div hidden={hidden}>
      <label className="mb-2 block font-medium">{label}</label>
      <input
        {...inputProps}
        className="w-full rounded border p-2"
        key={fieldMetadata.key}
        placeholder={placeholder}
        hidden={disabled}
      />
      {disabled && (
        <span className="block w-full rounded border bg-gray-100 p-2 text-gray-600">
          {fieldMetadata.value}
        </span>
      )}
      <ErrorMessage errors={fieldMetadata.errors} />
    </div>
  );
};

export default TextBox;
