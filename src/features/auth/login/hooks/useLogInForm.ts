import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useActionState } from "react";
import { login } from "@/features/auth/login/actions/login";
import {
  loginSchema,
  type LoginSchema,
} from "@/features/auth/login/lib/logInFormSchema";
import { useZodErrorMap } from "@/hooks/useZodErrorMap";

export const useLogInForm = () => {
  // zodの初期化
  useZodErrorMap();

  const [state, submitAction, loading] = useActionState(login, {
    status: "idle",
  });

  const [form, fields] = useForm<LoginSchema>({
    lastResult: state.submission,
    onValidate({ formData }) {
      const parseWithZoded = parseWithZod(formData, {
        schema: loginSchema,
      });
      return parseWithZoded;
    },
    shouldValidate: "onInput",
  });

  return { submitAction, loading, form, fields };
};