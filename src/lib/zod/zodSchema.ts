import { z } from "zod";
import { sizeInMB } from "@/lib/file";

type MimeType =
  | "image/jpeg"
  | "image/png"
  | "image/gif"
  | "image/svg+xml"
  | "video/mp4"
  | "video/webm"
  | "video/ogg"
  | "audio/mpeg"
  | "audio/ogg"
  | "audio/wav"
  | "text/plain"
  | "text/html"
  | "text/css"
  | "text/csv"
  | "application/json"
  | "application/pdf"
  | "application/zip"
  | "application/vnd.ms-excel"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  | ""; // For unknown file formats, an empty string ("") is used

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
  allowedTypes: MimeType[];
  maxSize: number;
}) => {
  // Convert allowed MIME types into simplified formats
  const allowedDescriptions = allowedTypes.map(simplifyMimeType);

  // Dynamically switch the schema type based on whether the file is required
  return z
    .custom<Required extends true ? File : File | undefined>(
      (file) => {
        // Allow `undefined` if the file is not required
        if (!required && (!file || file.size === 0)) return true;
        // Check if the file is an instance of `File`
        return file instanceof File;
      },
      {
        message: required ? "This field is required." : undefined,
      },
    )
    .refine(
      (file) => {
        if (isEmptyOrInvalidFile(file)) return true;
        return sizeInMB(file.size) <= maxSize;
      },
      {
        message: `The file size must not exceed ${maxSize}MB.`,
      },
    )
    .refine(
      (file) => {
        if (isEmptyOrInvalidFile(file)) return true;
        return allowedTypes.includes(file.type as MimeType);
      },
      {
        message: `Only the following types are allowed: ${allowedDescriptions.join(", ")}.`,
      },
    );
};
