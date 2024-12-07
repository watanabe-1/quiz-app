import { uploadBcExam } from "@/features/quiz/upload/pdf/businessCareer/actions/uploadBcExam";
import {
  UploadBcSchema,
  uploadBcSchema,
} from "@/features/quiz/upload/pdf/businessCareer/lib/uploadBcSchema";
import { useZodConForm } from "@/hooks/useZodConForm";

export const useUploadBcExamForm = () => {
  return useZodConForm<UploadBcSchema>({
    schema: uploadBcSchema,
    action: uploadBcExam,
  });
};
