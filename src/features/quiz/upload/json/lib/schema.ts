import { z } from "zod";
import { createFileSchema } from "@/lib/zod/zodSchema";
import { FileMimeType } from "@/types/conform";

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

const JSON_TYPES = ["application/json"] as FileMimeType[];
const MAX_JSON_SIZE = 5;

const jsonFileSchema = createFileSchema({
  allowedTypes: JSON_TYPES,
  maxSize: MAX_JSON_SIZE,
});

// UploadQuizForm のスキーマ
export const uploadQuizFormSchema: z.ZodType<UploadQuizForm> = z.object({
  qualification: z.string().min(1, "資格名を入力してください。"),
  grade: z.string().min(1, "級を入力してください。"),
  year: z.string().min(1, "年度を入力してください。"),
  file: jsonFileSchema,
  autoFill: z.boolean().optional(), // オプションフィールド（エラーメッセージ不要）
});
