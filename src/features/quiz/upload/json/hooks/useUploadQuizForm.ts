import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useActionState } from "react";
import { uploadQuiz } from "@/features/quiz/upload/json/actions/uploadQuiz";
import {
  UploadQuizFormSchema,
  uploadQuizFormSchema,
} from "@/features/quiz/upload/json/lib/schema";

export const useUploadQuizForm = () => {
  const [state, submitAction, loading] = useActionState(uploadQuiz, {
    status: "idle",
  });

  const [form, fields] = useForm<UploadQuizFormSchema>({
    lastResult: state.submission?.initialValue,
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
