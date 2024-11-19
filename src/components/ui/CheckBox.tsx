import { getInputProps } from "@conform-to/react";
import React from "react";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { ConformProps, OptionalFormMetadata } from "@/types/conform";

type CheckBoxProps = Omit<ConformProps<boolean>, OptionalFormMetadata> & {
  label: string;
  hidden?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

const CheckBox = ({
  label,
  fieldMetadata,
  hidden = false,
  onChange,
}: CheckBoxProps) => {
  const inputProps = getInputProps(fieldMetadata, { type: "checkbox" });

  return (
    <div hidden={hidden}>
      <input
        {...inputProps}
        className="mr-2"
        key={fieldMetadata.key}
        onChange={onChange}
      />
      <label className="mb-2 font-medium">{label}</label>
      <ErrorMessage errors={fieldMetadata.errors} />
    </div>
  );
};

export default CheckBox;
