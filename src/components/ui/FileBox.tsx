import { getInputProps } from "@conform-to/react";
import React from "react";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { ConformProps, OptionalFormMetadata } from "@/types/conform";

type FileBoxProps = Omit<ConformProps<File>, OptionalFormMetadata> & {
  label?: string;
  accept: string;
  hidden?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

const FileBox = ({
  label,
  accept,
  fieldMetadata,
  hidden = false,
  onChange,
}: FileBoxProps) => {
  const inputProps = getInputProps(fieldMetadata, { type: "file" });

  return (
    <div className="mb-4" hidden={hidden}>
      {label && <label className="mb-2 block font-medium">{label}</label>}
      <input
        {...inputProps}
        className="w-full"
        accept={accept}
        key={fieldMetadata.key}
        onChange={onChange}
      />
      <ErrorMessage errors={fieldMetadata.errors} />
    </div>
  );
};

export default FileBox;
