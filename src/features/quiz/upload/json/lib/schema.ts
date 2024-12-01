import { z } from "zod";
import { sizeInMB } from "@/lib/file";

/**
 * Represents upload data for form usage.
 */
export interface UploadQuizForm {
  /** The qualification or qualification of the question. */
  qualification: string;
  /** The grade or difficulty level of the question. */
  grade: string;
  /** The year or year of the question. */
  year: string;
  /** The question data. */
  file: File;
  /** The auto fill */
  autoFill?: boolean;
}

const JSON_TYPES = ["application/json"];
const MAX_JSON_SIZE = 5;

const fileSchema = z
  .custom<File>((file) => file instanceof File, { message: "必須です" })
  .refine((file) => sizeInMB(file.size) <= MAX_JSON_SIZE, {
    message: `ファイルサイズは最大${MAX_JSON_SIZE}MBです`,
  })
  .refine((file) => JSON_TYPES.includes(file.type), {
    message: ".jsonのみ可能です",
  });

// UploadQuizForm のスキーマ
export const uploadQuizFormSchema: z.ZodType<UploadQuizForm> = z.object({
  qualification: z.string().min(1, "資格名を入力してください。"),
  grade: z.string().min(1, "級を入力してください。"),
  year: z.string().min(1, "年度を入力してください。"),
  file: fileSchema,
  autoFill: z.boolean().optional(), // オプションフィールド（エラーメッセージ不要）
});

export type UploadQuizFormSchema = z.infer<typeof uploadQuizFormSchema>;
