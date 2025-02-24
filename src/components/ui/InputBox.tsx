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
  // conformはproxyで値が管理されているので、valueはここで必ず参照するようにする
  const { value } = fieldMetadata;

  return (
    <div hidden={hidden}>
      <label className="mb-2 block font-medium">{label}</label>
      <input
        {...inputProps}
        className="w-full rounded-sm border p-2"
        key={fieldMetadata.key}
        placeholder={placeholder}
        hidden={disabled}
      />
      {disabled && (
        <span className="block w-full rounded-sm border bg-gray-100 p-2 text-gray-600">
          {value}
          {/* 値が空の場合でも高さが保たれるよう、ダミー文字 - を見えない形（invisible）で挿入 */}
          {!value && <span className="invisible">-</span>}
        </span>
      )}
      <ErrorMessage errors={fieldMetadata.errors} />
    </div>
  );
};

export default InputBox;
