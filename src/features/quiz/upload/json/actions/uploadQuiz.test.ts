import { parseWithZod } from "@conform-to/zod";
import { withPermissionAll } from "@/features/permission/lib/withPermissionAll";
import { uploadQuiz } from "@/features/quiz/upload/json/actions/uploadQuiz";
import { revalidateTagByUpdateQuestions } from "@/lib/api";
import { saveQuestions } from "@/services/quizService";
import { FormState } from "@/types/conform";

jest.mock("@conform-to/zod", () => ({
  parseWithZod: jest.fn(),
}));
jest.mock("@/services/quizService", () => ({
  saveQuestions: jest.fn(),
}));
jest.mock("@/lib/api", () => ({
  revalidateTagByUpdateQuestions: jest.fn(),
}));
jest.mock("@/features/permission/lib/withPermissionAll");
(withPermissionAll as jest.Mock).mockImplementation(async (callback) =>
  callback(),
);

describe("uploadQuiz", () => {
  const mockFormState: FormState = { status: "idle", submission: undefined };
  const mockFormData = new FormData();
  mockFormData.append("file", new Blob(['[{"id": 1, "category": "test"}]']));

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return error if submission status is not success", async () => {
    const mockReply = jest.fn(() => ({ errors: ["Invalid input"] }));
    (parseWithZod as jest.Mock).mockReturnValue({
      status: "error",
      reply: mockReply,
    });

    const result = await uploadQuiz(mockFormState, mockFormData);

    expect(result).toEqual({
      status: "error",
      submission: { errors: ["Invalid input"] },
    });
    expect(mockReply).toHaveBeenCalled();
  });

  it("should return error if saveQuestions fails", async () => {
    const mockReply = jest.fn((args) => args || {});
    (parseWithZod as jest.Mock).mockReturnValue({
      status: "success",
      value: {
        qualification: "test-qualification",
        grade: "test-grade",
        year: 2024,
        file: new Blob(['[{"id": 1, "category": "test"}]']),
      },
      reply: mockReply,
    });

    (saveQuestions as jest.Mock).mockResolvedValue(false);

    const result = await uploadQuiz(mockFormState, mockFormData);

    expect(result).toEqual({
      status: "error",
      submission: {
        formErrors: ["データベースへの保存に失敗しました"],
      },
    });
    expect(mockReply).toHaveBeenCalledWith({
      formErrors: ["データベースへの保存に失敗しました"],
    });
  });

  it("should return success and call revalidateTagByUpdateQuestions on successful save", async () => {
    const mockReply = jest.fn(() => ({}));
    (parseWithZod as jest.Mock).mockReturnValue({
      status: "success",
      value: {
        qualification: "test-qualification",
        grade: "test-grade",
        year: 2024,
        file: new Blob(['[{"id": 1, "category": "test"}]']),
      },
      reply: mockReply,
    });

    (saveQuestions as jest.Mock).mockResolvedValue(true);

    const result = await uploadQuiz(mockFormState, mockFormData);

    expect(result).toEqual({
      status: "success",
      message: "データベースへの保存に成功しました",
      submission: {},
    });
    expect(mockReply).toHaveBeenCalled();
    expect(revalidateTagByUpdateQuestions).toHaveBeenCalled();
  });

  it("should handle JSON parsing errors gracefully", async () => {
    const mockReply = jest.fn(() => ({}));
    (parseWithZod as jest.Mock).mockReturnValue({
      status: "success",
      value: {
        qualification: "test-qualification",
        grade: "test-grade",
        year: 2024,
        file: new Blob(["invalid json"]),
      },
      reply: mockReply,
    });

    await expect(uploadQuiz(mockFormState, mockFormData)).rejects.toThrow(
      SyntaxError,
    );
  });
});
