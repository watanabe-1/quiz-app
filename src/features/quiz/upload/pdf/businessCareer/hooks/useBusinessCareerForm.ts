import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useActionState } from "react";
import { uploadBusinessCareer } from "@/features/quiz/upload/pdf/businessCareer/actions/uploadBusinessCareer";
import {
  UploadBusinessCareerSchema,
  uploadBusinessCareerSchema,
} from "@/features/quiz/upload/pdf/businessCareer/lib/businessCareerSchema";
import { useZodErrorMap } from "@/hooks/useZodErrorMap";

export const useBusinessCareerForm = () => {
  // zodの初期化
  useZodErrorMap();

  const [state, submitAction, loading] = useActionState(uploadBusinessCareer, {
    status: "idle",
  });

  const [form, fields] = useForm<UploadBusinessCareerSchema>({
    lastResult: state.submission,
    onValidate({ formData }) {
      const parseWithZoded = parseWithZod(formData, {
        schema: uploadBusinessCareerSchema,
      });
      return parseWithZoded;
    },
    shouldValidate: "onInput",
  });

  return { submitAction, loading, form, fields };
};
