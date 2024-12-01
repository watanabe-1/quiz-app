import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useActionState } from "react";
import { uploadBcExam } from "@/features/quiz/upload/pdf/businessCareer/actions/uploadBcExam";
import {
  UploadBcSchema,
  uploadBcSchema,
} from "@/features/quiz/upload/pdf/businessCareer/lib/businessCareerSchema";
import { useZodErrorMap } from "@/hooks/useZodErrorMap";

export const useUploadBcExamForm = () => {
  // zodの初期化
  useZodErrorMap();

  const [state, submitAction, loading] = useActionState(uploadBcExam, {
    status: "idle",
  });

  const [form, fields] = useForm<UploadBcSchema>({
    lastResult: state.submission,
    onValidate({ formData }) {
      const parseWithZoded = parseWithZod(formData, {
        schema: uploadBcSchema,
      });
      return parseWithZoded;
    },
    shouldValidate: "onInput",
  });

  return { submitAction, loading, form, fields };
};
