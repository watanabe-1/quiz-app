import { uploadQuiz } from "@/features/quiz/upload/json/actions/uploadQuiz";
import { uploadQuizFormSchema } from "@/features/quiz/upload/json/lib/schema";
import { useZodConForm } from "@/hooks/useZodConForm";

export const useUploadQuizForm = () => {
  return useZodConForm({
    schema: uploadQuizFormSchema,
    action: uploadQuiz,
  });
};
