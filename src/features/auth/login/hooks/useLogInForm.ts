import { login } from "@/features/auth/login/actions/login";
import { loginSchema } from "@/features/auth/login/lib/logInFormSchema";
import { useZodConForm } from "@/hooks/useZodConForm";

export const useLogInForm = () => {
  return useZodConForm({
    schema: loginSchema,
    action: login,
  });
};
