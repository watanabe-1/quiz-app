import { z } from "zod";
import { sizeInMB } from "@/lib/file";

const isEmptyOrInvalidFile = (file: File | undefined): file is undefined => {
  return !file || file.size === 0 || !(file instanceof File);
};

// MIMEタイプからapplication/やimage/を取り除くヘルパー関数
const simplifyMimeType = (mimeType: string) =>
  mimeType.replace(/^(application|image)\//, "").toUpperCase();

export const createFileSchema = <Required extends boolean | undefined = true>({
  required = true,
  allowedTypes,
  maxSize,
}: {
  required?: Required;
  allowedTypes: string[];
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
        return allowedTypes.includes(file.type);
      },
      {
        message: `${allowedDescriptions.join(", ")} のみ可能です`,
      },
    );
};
