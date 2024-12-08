import FormContainer from "@/components/ui/FormContainer";
import InputBox from "@/components/ui/InputBox";
import SubmitButton from "@/components/ui/SubmitButton";
import { useLogInForm } from "@/features/auth/login/hooks/useLogInForm";

const LogInForm = () => {
  const { submitAction, loading, form, fields } = useLogInForm();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded bg-white p-6 shadow">
        <h1 className="mb-6 text-center text-2xl font-bold">ログイン</h1>
        <FormContainer
          formMetadata={form}
          submitAction={submitAction}
          errorPosition="bottom"
        >
          <InputBox
            label="ユーザー名"
            placeholder="ユーザー名"
            fieldMetadata={fields.username}
          />
          <InputBox
            type="password"
            label="パスワード"
            placeholder="パスワード"
            fieldMetadata={fields.password}
          />
          <SubmitButton loading={loading} text="ログイン" fullWidth />
        </FormContainer>
      </div>
    </div>
  );
};

export default LogInForm;
