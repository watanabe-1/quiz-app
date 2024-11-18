import { parseWithZod } from "@conform-to/zod";
import { updateQuiz } from "@/features/quiz/edit/actions/quiz";
import { existsQuestion, saveQuestion } from "@/services/quizService";

jest.mock("@conform-to/zod");
jest.mock("@/lib/api");
jest.mock("@/services/quizService");

describe("updateQuiz", () => {
  const mockParseWithZod = parseWithZod as jest.Mock;
  const mockExistsQuestion = existsQuestion as jest.Mock;
  const mockSaveQuestion = saveQuestion as jest.Mock;

  const createMockFormData = (data: Record<string, string>): FormData => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));
    return formData;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return error if question does not exist", async () => {
    const mockReply = jest.fn(() => ({
      error: { general: ["Question not found"] },
    }));

    mockParseWithZod.mockReturnValue({
      status: "success",
      value: {
        qualification: "資格",
        grade: "1級",
        year: "2024",
        questionId: "123",
      },
      reply: mockReply,
    });

    mockExistsQuestion.mockReturnValue(false);

    const formData = createMockFormData({
      qualification: "資格",
      grade: "1級",
      year: "2024",
      questionId: "123",
    });

    const result = await updateQuiz({ status: "idle" }, formData);

    expect(result.status).toBe("error");
    expect(result.submission?.error).toEqual({
      general: ["Question not found"],
    });
    expect(mockReply).toHaveBeenCalledWith({
      formErrors: ["Question not found"],
    });
  });

  it("should return error if saving question fails", async () => {
    const mockReply = jest.fn(() => ({
      error: { general: ["Failed to update question"] },
    }));

    mockParseWithZod.mockReturnValue({
      status: "success",
      value: {
        qualification: "資格",
        grade: "1級",
        year: "2024",
        questionId: "123",
      },
      reply: mockReply,
    });

    mockExistsQuestion.mockReturnValue(true);
    mockSaveQuestion.mockResolvedValue(false);

    const formData = createMockFormData({
      qualification: "資格",
      grade: "1級",
      year: "2024",
      questionId: "123",
    });

    const result = await updateQuiz({ status: "idle" }, formData);

    expect(result.status).toBe("error");
    expect(result.submission?.error).toEqual({
      general: ["Failed to update question"],
    });
    expect(mockReply).toHaveBeenCalledWith({
      formErrors: ["Failed to update question"],
    });
  });
});
