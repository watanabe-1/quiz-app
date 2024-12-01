import { signOut } from "@/features/auth/auth";
import { LOGIN_ROUTE } from "@/features/auth/lib/authConstants";
import { logout } from "@/features/auth/logout/actions/logout";

// モック関数の定義
jest.mock("@/features/auth/auth", () => ({
  signOut: jest.fn(),
}));

describe("logout function", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should call signOut and return success when logout is successful", async () => {
    // モックされた signOut の挙動を定義
    (signOut as jest.Mock).mockResolvedValueOnce(undefined);

    // logout 関数の呼び出し
    const result = await logout();

    // signOut が正しく呼び出されたことを確認
    expect(signOut).toHaveBeenCalledWith({ redirectTo: LOGIN_ROUTE });
    expect(signOut).toHaveBeenCalledTimes(1);

    // logout の戻り値を確認
    expect(result).toEqual({ success: true });
  });

  test("should handle signOut rejection gracefully and return failure", async () => {
    // モックされた signOut がエラーをスローする
    const errorMessage = "Sign out failed";
    (signOut as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    let caughtError: string | undefined;

    try {
      await logout();
    } catch (error) {
      if (error instanceof Error) {
        caughtError = error.message;
      } else {
        caughtError = String(error);
      }
    }

    // エラー内容が正しいか確認
    expect(caughtError).toBe(errorMessage);

    // signOut が呼び出されたことを確認
    expect(signOut).toHaveBeenCalledWith({ redirectTo: LOGIN_ROUTE });
    expect(signOut).toHaveBeenCalledTimes(1);
  });
});
