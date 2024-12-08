import FormContainer from "@/components/ui/FormContainer";
import InputBox from "@/components/ui/InputBox";
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
          <button
            type="submit"
            className={`w-full rounded bg-blue-600 py-2 text-white transition duration-200 hover:bg-blue-700 ${
              loading ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={loading}
          >
            {loading ? "ログイン中..." : "ログイン"}
          </button>
        </FormContainer>
      </div>
    </div>
  );
};

export default LogInForm;
