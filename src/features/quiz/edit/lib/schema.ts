import { z } from "zod";
import { createFileSchema } from "@/lib/zod/zodSchema";
import { FileMimeType } from "@/types/conform";
import { MediaContent, QuestionOption, QuestionData } from "@/types/quizType";

/**
 * Represents media content for form usage, which can include text, an image URL, and/or an image file.
 */
interface MediaContentForm extends MediaContent {
  /** Optional image file for the media content. */
  imageFile?: File;
}

/**
 * Represents an option in a question for form usage, including possible image file.
 */
interface QuestionOptionForm extends QuestionOption {
  /** Optional image file representing the option. */
  imageFile?: File;
  /** Optional explanation related to the option, using MediaContentForm. */
  explanation?: MediaContentForm;
}

/**
 * Represents question data for form usage.
 */
interface QuestionDataForm extends QuestionData {
  /** The content of the question, using MediaContentForm. */
  question: MediaContentForm;
  /** List of possible options for answering the question, using QuestionOptionForm. */
  options: QuestionOptionForm[];
  /** Optional explanation for the question, using MediaContentForm. */
  explanation?: MediaContentForm;
}

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"] as FileMimeType[];
const MAX_IMAGE_SIZE = 5;

const imageFileSchema = createFileSchema({
  required: false,
  allowedTypes: IMAGE_TYPES,
  maxSize: MAX_IMAGE_SIZE,
});

// MediaContentForm のスキーマ
const mediaContentSchema: z.ZodType<MediaContentForm> = z.object({
  text: z.string().optional(),
  image: z.string().optional(),
  imageFile: imageFileSchema.optional(),
});

// QuestionOptionForm のスキーマ
const questionOptionSchema: z.ZodType<QuestionOptionForm> = z.object({
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
