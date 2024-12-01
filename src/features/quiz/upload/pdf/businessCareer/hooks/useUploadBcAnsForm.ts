import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useActionState } from "react";
import { uploadBcAns } from "@/features/quiz/upload/pdf/businessCareer/actions/uploadBcAns";
import {
  UploadBcSchema,
  uploadBcSchema,
} from "@/features/quiz/upload/pdf/businessCareer/lib/uploadBcSchema";
import { useZodErrorMap } from "@/hooks/useZodErrorMap";

export const useUploadBcAnsForm = () => {
  // zodの初期化
  useZodErrorMap();

  const [state, submitAction, loading] = useActionState(uploadBcAns, {
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
