import { login } from "@/features/auth/login/actions/login";
import {
  loginSchema,
  type LoginSchema,
} from "@/features/auth/login/lib/logInFormSchema";
import { useZodConForm } from "@/hooks/useZodConForm";

export const useLogInForm = () => {
  return useZodConForm<LoginSchema>({
    schema: loginSchema,
    action: login,
  });
};
