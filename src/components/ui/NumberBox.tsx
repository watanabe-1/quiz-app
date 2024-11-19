import { getInputProps } from "@conform-to/react";
import React from "react";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { ConformProps, OptionalFormMetadata } from "@/types/conform";

type NumberBoxProps = Omit<ConformProps<number>, OptionalFormMetadata> & {
  label: string;
  hidden?: boolean;
};

const NumberBox = ({
  label,
  fieldMetadata,
  hidden = false,
}: NumberBoxProps) => {
  const inputProps = getInputProps(fieldMetadata, { type: "number" });

  return (
    <div hidden={hidden}>
      <label className="mb-2 block font-medium">{label}</label>
      <input
        {...inputProps}
        className="w-full rounded border p-2"
        key={fieldMetadata.key}
      />
      <ErrorMessage errors={fieldMetadata.errors} />
    </div>
  );
};

export default NumberBox;
