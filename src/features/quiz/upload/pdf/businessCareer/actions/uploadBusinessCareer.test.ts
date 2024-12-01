import { parseWithZod } from "@conform-to/zod";
import pdfParse from "pdf-parse";
import { uploadBusinessCareer } from "@/features/quiz/upload/pdf/businessCareer/actions/uploadBusinessCareer";
import { parseProblems } from "@/features/quiz/upload/pdf/businessCareer/lib/api/bcExam";
import {
  extractYear,
  extractTitle,
  extractGradeAndQualification,
  replaceSpacesWithUnderscore,
} from "@/features/quiz/upload/pdf/businessCareer/lib/api/bcUtils";
import { revalidateTagByUpdateQuestions } from "@/lib/api";
import { saveQuestions } from "@/services/quizService";
import { FormState } from "@/types/conform";

jest.mock("@conform-to/zod", () => ({
  parseWithZod: jest.fn(),
}));
jest.mock("pdf-parse", () => jest.fn());
jest.mock("@/features/quiz/upload/pdf/businessCareer/lib/api/bcUtils", () => ({
  replaceSpacesWithUnderscore: jest.fn(),
  extractYear: jest.fn(),
  extractTitle: jest.fn(),
  extractGradeAndQualification: jest.fn(),
}));
jest.mock("@/features/quiz/upload/pdf/businessCareer/lib/api/bcExam", () => ({
  parseProblems: jest.fn(),
}));
jest.mock("@/services/quizService", () => ({
  saveQuestions: jest.fn(),
}));
jest.mock("@/lib/api", () => ({
  revalidateTagByUpdateQuestions: jest.fn(),
}));

describe("uploadBusinessCareer", () => {
  const mockFormState: FormState = { status: "idle", submission: undefined };
  const mockFormData = new FormData();
  mockFormData.append(
    "file",
    new Blob(["dummy PDF content"], { type: "application/pdf" }),
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return error if submission status is not success", async () => {
    const mockReply = jest.fn(() => ({ errors: ["Invalid input"] }));
    (parseWithZod as jest.Mock).mockReturnValue({
      status: "error",
      reply: mockReply,
    });

    const result = await uploadBusinessCareer(mockFormState, mockFormData);

    expect(result).toEqual({
      status: "error",
      submission: { errors: ["Invalid input"] },
    });
    expect(mockReply).toHaveBeenCalled();
  });

  it("should return error if required data is missing", async () => {
    const mockReply = jest.fn((args) => args || {});
    (parseWithZod as jest.Mock).mockReturnValue({
      status: "success",
      value: {
        file: new Blob(["dummy PDF content"]),
      },
      reply: mockReply,
    });

    (pdfParse as jest.Mock).mockResolvedValue({ text: "dummy parsed text" });
    (extractYear as jest.Mock).mockReturnValue(null);
    (extractTitle as jest.Mock).mockReturnValue(null);
    (extractGradeAndQualification as jest.Mock).mockReturnValue(null);
    (parseProblems as jest.Mock).mockReturnValue(null);

    const result = await uploadBusinessCareer(mockFormState, mockFormData);

    expect(result).toEqual({
      status: "error",
      submission: {
        formErrors: ["PDFの解析に失敗しました"],
      },
    });
    expect(mockReply).toHaveBeenCalledWith({
      formErrors: ["PDFの解析に失敗しました"],
    });
  });

  it("should return error if saveQuestions fails", async () => {
    const mockReply = jest.fn((args) => args || {});
    (parseWithZod as jest.Mock).mockReturnValue({
      status: "success",
      value: {
        file: new Blob(["dummy PDF content"]),
      },
      reply: mockReply,
    });

    (pdfParse as jest.Mock).mockResolvedValue({ text: "dummy parsed text" });
    (extractYear as jest.Mock).mockReturnValue("2024");
    (replaceSpacesWithUnderscore as jest.Mock).mockReturnValue("2024");
    (extractTitle as jest.Mock).mockReturnValue("Test Title");
    (extractGradeAndQualification as jest.Mock).mockReturnValue({
      grade: "1",
      qualification: "Test Qualification",
    });
    (parseProblems as jest.Mock).mockReturnValue([
      { id: 1, question: "test", options: [], answer: 1 },
    ]);
    (saveQuestions as jest.Mock).mockResolvedValue(false);

    const result = await uploadBusinessCareer(mockFormState, mockFormData);

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
        file: new Blob(["dummy PDF content"]),
      },
      reply: mockReply,
    });

    (pdfParse as jest.Mock).mockResolvedValue({ text: "dummy parsed text" });
    (extractYear as jest.Mock).mockReturnValue("2024");
    (replaceSpacesWithUnderscore as jest.Mock).mockReturnValue("2024");
    (extractTitle as jest.Mock).mockReturnValue("Test Title");
    (extractGradeAndQualification as jest.Mock).mockReturnValue({
      grade: "1",
      qualification: "Test Qualification",
    });
    (parseProblems as jest.Mock).mockReturnValue([
      { id: 1, question: "test", options: [], answer: 1 },
    ]);
    (saveQuestions as jest.Mock).mockResolvedValue(true);

    const result = await uploadBusinessCareer(mockFormState, mockFormData);

    expect(result).toEqual({
      status: "success",
      message: "データベースへの保存に成功しました",
      submission: {},
    });
    expect(mockReply).toHaveBeenCalled();
    expect(revalidateTagByUpdateQuestions).toHaveBeenCalled();
  });

  it("should handle PDF parsing errors gracefully", async () => {
    const mockReply = jest.fn((args) => args || {});
    (parseWithZod as jest.Mock).mockReturnValue({
      status: "success",
      value: {
        file: new Blob(["invalid PDF content"]),
      },
      reply: mockReply,
    });

    (pdfParse as jest.Mock).mockRejectedValue(new Error("PDF parsing failed"));

    const result = await uploadBusinessCareer(mockFormState, mockFormData);

    expect(result).toEqual({
      status: "error",
      submission: {
        formErrors: ["PDFの解析に失敗しました"],
      },
    });
    expect(mockReply).toHaveBeenCalledWith({
      formErrors: ["PDFの解析に失敗しました"],
    });
  });
});
