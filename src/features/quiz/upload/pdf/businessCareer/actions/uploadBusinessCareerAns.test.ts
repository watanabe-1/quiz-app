import { parseWithZod } from "@conform-to/zod";
import pdfParse from "pdf-parse";
import {
  parseAnsData,
  modifyGradeText,
} from "@/features/businessCareer/api/bcAns";
import {
  replaceSpacesWithUnderscore,
  extractGradeAndQualification,
  convertSingleKatakanaToNumber,
} from "@/features/businessCareer/api/bcUtils";
import { uploadBusinessCareerAns } from "@/features/quiz/upload/pdf/businessCareer/actions/uploadBusinessCareerAns";
import { revalidateTagByUpdateQuestion } from "@/lib/api";
import {
  existsData,
  getQuestions,
  updateQuestionAnswer,
} from "@/services/quizService";

jest.mock("@conform-to/zod");
jest.mock("pdf-parse");
jest.mock("pdf-parse", () => jest.fn());
jest.mock("@/features/businessCareer/api/bcAns");
jest.mock("@/features/businessCareer/api/bcUtils");
jest.mock("@/lib/api");
jest.mock("@/services/quizService");

describe("uploadBusinessCareerAns", () => {
  let mockFormData: FormData;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFormData = new FormData();
    mockFormData.append(
      "file",
      new Blob(["dummy PDF content"], { type: "application/pdf" }),
    );
  });

  it("should return error if submission status is not success", async () => {
    const mockReply = jest.fn(() => ({ errors: ["Invalid input"] }));
    (parseWithZod as jest.Mock).mockReturnValue({
      status: "error",
      reply: mockReply,
    });

    const result = await uploadBusinessCareerAns(
      { status: "idle" },
      mockFormData,
    );

    expect(result.status).toBe("error");
    expect(result.submission.errors).toEqual(["Invalid input"]);
    expect(parseWithZod).toHaveBeenCalledWith(mockFormData, {
      schema: expect.anything(),
    });
  });

  it("should return error if PDF parsing fails", async () => {
    const mockReply = jest.fn((args) => args || {});
    (parseWithZod as jest.Mock).mockReturnValue({
      status: "success",
      value: { file: new Blob() },
      reply: mockReply,
    });
    (pdfParse as jest.Mock).mockRejectedValue(new Error("PDF parsing failed"));

    const result = await uploadBusinessCareerAns(
      { status: "idle" },
      mockFormData,
    );

    expect(result.status).toBe("error");
    expect(result.submission.formErrors).toEqual(["PDFの解析に失敗しました"]);
    expect(pdfParse).toHaveBeenCalled();
  });

  it("should successfully update database when data exists", async () => {
    (parseWithZod as jest.Mock).mockReturnValue({
      status: "success",
      value: { file: new Blob() },
      reply: jest.fn(),
    });
    (pdfParse as jest.Mock).mockResolvedValue({ text: "dummy PDF text" });
    (parseAnsData as jest.Mock).mockReturnValue({
      year: "2024",
      categories: [
        {
          category: "Category 1",
          answers: [{ questionNumber: 1, answer: "ア" }],
        },
      ],
    });
    (replaceSpacesWithUnderscore as jest.Mock).mockReturnValue("2024");
    (modifyGradeText as jest.Mock).mockReturnValue("Category 1");
    (extractGradeAndQualification as jest.Mock).mockReturnValue({
      grade: "Grade 1",
      qualification: "Qualification 1",
    });
    (existsData as jest.Mock).mockResolvedValue(true);
    (getQuestions as jest.Mock).mockResolvedValue([
      { questionId: 1, answer: "1" },
    ]);
    (convertSingleKatakanaToNumber as jest.Mock).mockReturnValue("1");
    (updateQuestionAnswer as jest.Mock).mockResolvedValue(true);

    const result = await uploadBusinessCareerAns(
      { status: "idle" },
      mockFormData,
    );

    expect(result.status).toBe("success");
    expect(replaceSpacesWithUnderscore).toHaveBeenCalledWith("2024");
    expect(getQuestions).toHaveBeenCalledWith(
      "Qualification 1",
      "Grade 1",
      "2024",
    );
    expect(updateQuestionAnswer).toHaveBeenCalledWith(
      "Qualification 1",
      "Grade 1",
      "2024",
      1,
      "1",
    );
    expect(revalidateTagByUpdateQuestion).toHaveBeenCalled();
  });
});
