import { getInputProps } from "@conform-to/react";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { ConformProps } from "@/types/conform";

type ImageBoxProps = ConformProps<File> & {
  label: string;
  hidden?: boolean;
};

const ImageBox = ({
  label,
  fieldMetadata,
  formMetadata,
  hidden = false,
}: ImageBoxProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputProps = getInputProps(fieldMetadata, { type: "file" });

  useEffect(() => {
    if (fieldMetadata.value instanceof File) {
      setPreviewUrl(URL.createObjectURL(fieldMetadata.value));
    } else {
      setPreviewUrl(null);
    }
  }, [fieldMetadata.value]);

  const handleDelete = () => {
    setPreviewUrl(null);
    formMetadata.update({
      name: fieldMetadata.name,
      value: undefined,
    });
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="mb-4" hidden={hidden}>
      <label className="mb-2 block font-medium">{label}</label>
      <input
        {...inputProps}
        className="w-full"
        accept="image/*"
        key={fieldMetadata.key}
        ref={inputRef}
      />
      <ErrorMessage errors={fieldMetadata.errors} />
      {previewUrl && (
        <div className="mt-2">
          <Image
            src={previewUrl}
            alt={label}
            layout="responsive"
            width={600}
            height={400}
            unoptimized
          />
          <button
            type="button"
            onClick={handleDelete}
            className="mt-2 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            画像を削除
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageBox;
