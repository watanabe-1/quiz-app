import { getInputProps } from "@conform-to/react";
import React from "react";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { ConformProps, OptionalFormMetadata } from "@/types/conform";

type InputBoxProps<T extends "text" | "password" | "number" = "text"> = Omit<
  ConformProps<T extends "number" ? number : string>,
  OptionalFormMetadata
> & {
  label: string;
  placeholder?: string;
  hidden?: boolean;
  disabled?: boolean;
  type?: T;
};

const InputBox = <T extends "text" | "password" | "number" = "text">({
  label,
  fieldMetadata,
  placeholder = "",
  type = "text" as T,
  hidden = false,
  disabled = false,
}: InputBoxProps<T>) => {
  const inputProps = getInputProps(fieldMetadata, { type });

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

export default InputBox;