import { uploadQuiz } from "@/features/quiz/upload/json/actions/uploadQuiz";
import {
  UploadQuizFormSchema,
  uploadQuizFormSchema,
} from "@/features/quiz/upload/json/lib/schema";
import { useZodConForm } from "@/hooks/useZodConForm";

export const useUploadQuizForm = () => {
  return useZodConForm<UploadQuizFormSchema>({
    schema: uploadQuizFormSchema,
    action: uploadQuiz,
  });
};
