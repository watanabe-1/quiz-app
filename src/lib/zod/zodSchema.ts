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
  | ""; // 未知のファイル形式の場合は空文字列 ("") になる

/**
 * チェック対象のファイルが未定義または無効であるかを判定します。
 * @param file - チェック対象の `File` オブジェクトまたは `undefined`
 * @returns ファイルが未定義または無効の場合は `true`
 */
const isEmptyOrInvalidFile = (file: File | undefined): file is undefined => {
  return !file || file.size === 0 || !(file instanceof File);
};

/**
 * MIMEタイプから "application/" や "image/" を取り除き、大文字に変換します。
 * @param mimeType - MIMEタイプの文字列
 * @returns 簡略化された MIMEタイプ
 */
const simplifyMimeType = (mimeType: string) =>
  mimeType.replace(/^(application|image)\//, "").toUpperCase();

/**
 * ファイルスキーマを生成するための関数。
 * ファイルの必須性、許可されるMIMEタイプ、最大サイズを基にバリデーションを行います。
 *
 * @template Required - ファイルが必須かどうかを表す型（`true` または `undefined`）
 * @param options - ファイルスキーマのオプション
 * @param options.required - ファイルが必須かどうか（デフォルト: `true`）
 * @param options.allowedTypes - 許可されるMIMEタイプの配列
 * @param options.maxSize - ファイルの最大サイズ（MB単位）
 * @returns ファイルスキーマ
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
        return allowedTypes.includes(file.type as MimeType);
      },
      {
        message: `${allowedDescriptions.join(", ")} のみ可能です`,
      },
    );
};
