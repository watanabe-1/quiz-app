import { uploadBcAns } from "@/features/quiz/upload/pdf/businessCareer/actions/uploadBcAns";
import {
  UploadBcSchema,
  uploadBcSchema,
} from "@/features/quiz/upload/pdf/businessCareer/lib/uploadBcSchema";
import { useZodConForm } from "@/hooks/useZodConForm";

export const useUploadBcAnsForm = () => {
  return useZodConForm<UploadBcSchema>({
    schema: uploadBcSchema,
    action: uploadBcAns,
  });
};
