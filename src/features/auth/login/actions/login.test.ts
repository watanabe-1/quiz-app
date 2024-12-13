import { parseWithZod } from "@conform-to/zod";
import { signIn } from "@/features/auth/auth";
import { LOGIN_REDIRECT } from "@/features/auth/lib/authConstants";
import { login } from "@/features/auth/login/actions/login";

jest.mock("@conform-to/zod");
jest.mock("@/features/auth/auth");

describe("login", () => {
  const mockParseWithZod = parseWithZod as jest.Mock;
  const mockSignIn = signIn as jest.Mock;

  const createMockFormData = (data: Record<string, string>): FormData => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));

    return formData;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call signIn and return success on valid credentials", async () => {
    const mockReply = jest.fn();

    mockParseWithZod.mockReturnValue({
      status: "success",
      value: { username: "testuser", password: "password123" },
      reply: mockReply,
    });

    mockSignIn.mockResolvedValueOnce(undefined);

    const formData = createMockFormData({
      username: "testuser",
      password: "password123",
    });

    const result = await login({ status: "idle" }, formData);

    expect(mockSignIn).toHaveBeenCalledWith("credentials", {
      username: "testuser",
      password: "password123",
      redirectTo: LOGIN_REDIRECT,
    });
    expect(result.status).toBe("success");
    expect(result.submission).toEqual(mockReply());
  });

  it("should throw an error for unexpected exceptions", async () => {
    const mockReply = jest.fn();

    mockParseWithZod.mockReturnValue({
      status: "success",
      value: { username: "testuser", password: "password123" },
      reply: mockReply,
    });

    const unexpectedError = new Error("Unexpected error");
    mockSignIn.mockRejectedValueOnce(unexpectedError);

    const formData = createMockFormData({
      username: "testuser",
      password: "password123",
    });

    await expect(login({ status: "idle" }, formData)).rejects.toThrow(
      "Unexpected error",
    );

    expect(mockSignIn).toHaveBeenCalledWith("credentials", {
      username: "testuser",
      password: "password123",
      redirectTo: LOGIN_REDIRECT,
    });
  });
});
