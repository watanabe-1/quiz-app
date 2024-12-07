import { uploadBcExam } from "@/features/quiz/upload/pdf/businessCareer/actions/uploadBcExam";
import { uploadBcSchema } from "@/features/quiz/upload/pdf/businessCareer/lib/uploadBcSchema";
import { useZodConForm } from "@/hooks/useZodConForm";

export const useUploadBcExamForm = () => {
  return useZodConForm({
    schema: uploadBcSchema,
    action: uploadBcExam,
  });
};
