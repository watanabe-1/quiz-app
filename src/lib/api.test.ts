import {
  fetchGetAllQualifications,
  fetchGetGradesByQualification,
  fetchGetYearsByQualificationAndGrade,
  fetchGetCategories,
  fetchGetQuestionsByCategory,
  fetchGetQuestionsByCategoryAndId,
} from "@/lib/api";
import { QuestionData } from "@/types/quizType";

global.fetch = jest.fn();

// Mock Next.js headers and cookies functions
jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    toString: jest.fn().mockReturnValue("mocked-cookie"),
  })),
  headers: jest.fn(() => ({
    get: jest.fn((key: string) => `mocked-${key}`),
  })),
}));

describe("API Functions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("fetchGetAllQualifications should return an array of qualifications", async () => {
    const mockQualifications = ["Qualification1", "Qualification2"];
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockQualifications),
    });

    const qualifications = await fetchGetAllQualifications();
    expect(fetch).toHaveBeenCalled();
    expect(qualifications).toEqual(mockQualifications);
  });

  test("fetchGetGradesByQualification should return an array of grades", async () => {
    const qualification = "TestQualification";
    const mockGrades = ["Grade1", "Grade2"];
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockGrades),
    });

    const grades = await fetchGetGradesByQualification(qualification);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(qualification),
      expect.any(Object),
    );
    expect(grades).toEqual(mockGrades);
  });

  test("fetchGetYearsByQualificationAndGrade should return an array of years", async () => {
    const qualification = "TestQualification";
    const grade = "TestGrade";
    const mockYears = ["2021", "2022"];
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockYears),
    });

    const years = await fetchGetYearsByQualificationAndGrade(
      qualification,
      grade,
    );
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(grade),
      expect.any(Object),
    );
    expect(years).toEqual(mockYears);
  });

  test("fetchGetCategories should return an array of categories", async () => {
    const qualification = "TestQualification";
    const grade = "TestGrade";
    const year = "2022";
    const mockCategories = ["Category1", "Category2"];
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockCategories),
    });

    const categories = await fetchGetCategories(qualification, grade, year);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(year),
      expect.any(Object),
    );
    expect(categories).toEqual(mockCategories);
  });

  test("fetchGetQuestionsByCategory should return an array of questions", async () => {
    const qualification = "TestQualification";
    const grade = "TestGrade";
    const year = "2022";
    const category = "Category1";
    const mockQuestions: QuestionData[] = [
      {
        questionId: 1,
        category,
        question: { text: "Question 1" },
        options: [],
        answer: 0,
        qualification: qualification,
        grade: grade,
        year: year,
      },
    ];
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockQuestions),
    });

    const questions = await fetchGetQuestionsByCategory(
      qualification,
      grade,
      year,
      category,
    );
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(category),
      expect.any(Object),
    );
    expect(questions).toEqual(mockQuestions);
  });

  test("fetchGetQuestionsByCategoryAndId should return a specific question", async () => {
    const qualification = "TestQualification";
    const grade = "TestGrade";
    const year = "2022";
    const category = "Category1";
    const id = 1;
    const mockQuestion: QuestionData = {
      questionId: id,
      category,
      question: { text: "Question 1" },
      options: [],
      answer: 0,
      qualification: qualification,
      grade: grade,
      year: year,
    };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockQuestion),
    });

    const question = await fetchGetQuestionsByCategoryAndId(
      qualification,
      grade,
      year,
      category,
      id,
    );
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(id.toString()),
      expect.any(Object),
    );
    expect(question).toEqual(mockQuestion);
  });
});
