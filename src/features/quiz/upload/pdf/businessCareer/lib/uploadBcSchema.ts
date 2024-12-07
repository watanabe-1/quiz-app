import { z } from "zod";
import { sizeInMB } from "@/lib/file";

const PDF_TYPES = ["application/pdf"];
const MAX_PDF_SIZE = 5;

const fileSchema = z
  .custom<File>((file) => file instanceof File, { message: "必須です" })
  .refine((file) => sizeInMB(file.size) <= MAX_PDF_SIZE, {
    message: `ファイルサイズは最大${MAX_PDF_SIZE}MBです`,
  })
  .refine((file) => PDF_TYPES.includes(file.type), {
    message: ".pdfのみ可能です",
  });

export const uploadBcSchema = z.object({
  file: fileSchema,
});
