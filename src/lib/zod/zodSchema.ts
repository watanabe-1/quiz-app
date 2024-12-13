import { z } from "zod";
import { sizeInMB } from "@/lib/file";
import { FileMimeType } from "@/types/conform";

/**
 * Determines if the provided file is either undefined or invalid.
 * @param file - The `File` object to check, or `undefined`.
 * @returns `true` if the file is undefined, has zero size, or is not an instance of `File`.
 */
const isEmptyOrInvalidFile = (file: File | undefined): file is undefined => {
  return !file || file.size === 0 || !(file instanceof File);
};

/**
 * Helper function to simplify a MIME type by removing "application/" or "image/"
 * and converting the result to uppercase.
 * @param mimeType - The MIME type string.
 * @returns The simplified MIME type string.
 */
const simplifyMimeType = (mimeType: string) =>
  mimeType.replace(/^(application|image)\//, "").toUpperCase();

/**
 * Creates a validation schema for a file, allowing checks for its required status,
 * permitted MIME types, and maximum file size.
 *
 * @template Required - Indicates whether the file is required (`true`) or not (`undefined`).
 * @param options - Options to configure the schema.
 * @param options.required - Whether the file is required. Defaults to `true`.
 * @param options.allowedTypes - An array of allowed MIME types.
 * @param options.maxSize - The maximum file size allowed, in megabytes.
 * @returns A Zod schema for validating the file.
 */
export const createFileSchema = <Required extends boolean | undefined = true>({
  required = true,
  allowedTypes,
  maxSize,
}: {
  required?: Required;
  allowedTypes: FileMimeType[];
  maxSize: number;
}) => {
  // 許可されているタイプを簡略化した形式に変換
  const allowedDescriptions = allowedTypes.map(simplifyMimeType);

  // 必須かどうかで型を動的に切り替え
  return z
    .custom<Required extends true ? File : File | undefined>(
      (file) => {
        // 必須でない場合、undefinedを許容
        if (!required && (!file || file.size === 0)) return true;

        // File型かどうかのチェック
        return file instanceof File;
      },
      {
        message: required ? "必須です" : undefined,
      },
    )
    .refine(
      (file) => {
        if (isEmptyOrInvalidFile(file)) return true;

        return sizeInMB(file.size) <= maxSize;
      },
      {
        message: `ファイルサイズは最大${maxSize}MBです`,
      },
    )
    .refine(
      (file) => {
        if (isEmptyOrInvalidFile(file)) return true;

        return allowedTypes.includes(file.type as FileMimeType);
      },
      {
        message: `${allowedDescriptions.join(", ")} のみ可能です`,
      },
    );
};
