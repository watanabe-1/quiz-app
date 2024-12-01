import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useActionState } from "react";
import { uploadQuiz } from "@/features/quiz/upload/json/actions/uploadQuiz";
import {
  UploadQuizFormSchema,
  uploadQuizFormSchema,
} from "@/features/quiz/upload/json/lib/schema";
import { useZodErrorMap } from "@/hooks/useZodErrorMap";

export const useUploadQuizForm = () => {
  // zodの初期化
  useZodErrorMap();

  const [state, submitAction, loading] = useActionState(uploadQuiz, {
    status: "idle",
  });

  const [form, fields] = useForm<UploadQuizFormSchema>({
    lastResult: state.submission,
    onValidate({ formData }) {
      const parseWithZoded = parseWithZod(formData, {
        schema: uploadQuizFormSchema,
      });
      return parseWithZoded;
    },
    shouldValidate: "onInput",
  });

  return { submitAction, loading, form, fields };
};
