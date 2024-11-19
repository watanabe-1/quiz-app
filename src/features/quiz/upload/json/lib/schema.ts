import { z, ZodType } from "zod";
import { parseFileName } from "@/features/quiz/upload/json/lib/parseFileName";

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

const jsonFileSchema: ZodType<File> = z.custom<File>(
  (file) => {
    if (!(file instanceof File)) return false;

    if (!file || file.size === 0)
      return {
        message: "ファイルが空です。",
      };

    // 許可するJSONの MIME タイプ
    const allowedTypes = ["application/json"];

    // MIME タイプが許可リストに含まれているか
    if (!allowedTypes.includes(file.type)) {
      return {
        message: "無効なファイル形式です。JSONファイルを選択してください。",
      };
    }

    // ファイルサイズの上限 (例: 5MB 以下)
    const maxSizeInMB = 5;
    if (file.size > maxSizeInMB * 1024 * 1024) {
      return {
        message: `ファイルサイズが大きすぎます。${maxSizeInMB}MB以下のファイルを選択してください。`,
      };
    }

    // ファイル名の形式をチェック
    const parsedFileName = parseFileName(file);
    if (!parsedFileName) {
      return {
        message:
          "ファイル名の形式が正しくありません。資格名_級_年度の形式にしてください。",
      };
    }

    return true; // すべての条件を満たしている場合
  },
  {
    message: "ファイルの検証に失敗しました。",
  },
);

// UploadQuizForm のスキーマ
export const uploadQuizFormSchema: z.ZodType<UploadQuizForm> = z.object({
  qualification: z.string().min(1, "資格名を入力してください。"),
  grade: z.string().min(1, "級を入力してください。"),
  year: z.string().min(1, "年度を入力してください。"),
  file: jsonFileSchema,
  autoFill: z.boolean().optional(), // オプションフィールド（エラーメッセージ不要）
});

export type UploadQuizFormSchema = z.infer<typeof uploadQuizFormSchema>;
