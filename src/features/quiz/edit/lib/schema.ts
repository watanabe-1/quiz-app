import { z, ZodType } from "zod";
import { MediaContent, QuestionOption, QuestionData } from "@/types/quizType";

/**
 * Represents media content for form usage, which can include text, an image URL, and/or an image file.
 */
export interface MediaContentForm extends MediaContent {
  /** Optional image file for the media content. */
  imageFile?: File;
}

/**
 * Represents an option in a question for form usage, including possible image file.
 */
export interface QuestionOptionForm extends QuestionOption {
  /** Optional image file representing the option. */
  imageFile?: File;
  /** Optional explanation related to the option, using MediaContentForm. */
  explanation?: MediaContentForm;
}

/**
 * Represents question data for form usage.
 */
export interface QuestionDataForm extends QuestionData {
  /** The content of the question, using MediaContentForm. */
  question: MediaContentForm;
  /** List of possible options for answering the question, using QuestionOptionForm. */
  options: QuestionOptionForm[];
  /** Optional explanation for the question, using MediaContentForm. */
  explanation?: MediaContentForm;
}

// 画像ファイルのみに限定した Zod スキーマ
const imageFileSchema: ZodType<File> = z.custom<File>(
  (file) => {
    if (!(file instanceof File)) return false;

    if (!file || file.size === 0) return true;

    // 許可する画像の MIME タイプ
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

    // MIME タイプが許可リストに含まれているか
    if (!allowedTypes.includes(file.type)) return false;

    // ファイルサイズの上限 (例: 5MB 以下)
    const maxSizeInMB = 5;
    if (file.size > maxSizeInMB * 1024 * 1024) return false;

    return true;
  },
  {
    message:
      "Invalid file. Only JPEG, PNG, or GIF images under 5MB are allowed.",
  },
);

// MediaContentForm のスキーマ
export const mediaContentSchema: z.ZodType<MediaContentForm> = z.object({
  text: z.string().optional(),
  image: z.string().optional(),
  imageFile: imageFileSchema.optional(),
});

// QuestionOptionForm のスキーマ
export const questionOptionSchema: z.ZodType<QuestionOptionForm> = z.object({
  text: z.string(),
  image: z.string().optional(),
  imageFile: imageFileSchema.optional(),
  explanation: mediaContentSchema.optional(),
});

// QuestionDataForm のスキーマ
export const questionDataSchema: z.ZodType<QuestionDataForm> = z.object({
  qualification: z.string(),
  id: z.number().optional(),
  questionId: z.number(),
  grade: z.string(),
  category: z.string(),
  year: z.string(),
  question: mediaContentSchema,
  options: z.array(questionOptionSchema),
  answer: z.number(),
  explanation: mediaContentSchema.optional(),
});
