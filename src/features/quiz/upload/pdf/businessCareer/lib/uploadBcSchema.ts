import { z } from "zod";
import { createFileSchema } from "@/lib/zod/zodSchema";

const PDF_TYPES = ["application/pdf"];
const MAX_PDF_SIZE = 5;

const pdfFileSchema = createFileSchema({
  allowedTypes: PDF_TYPES,
  maxSize: MAX_PDF_SIZE,
});

export const uploadBcSchema = z.object({
  file: pdfFileSchema,
});
