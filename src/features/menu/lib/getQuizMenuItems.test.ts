import {
  parseQuizCurrentUrl,
  getQualificationItems,
  getGradeItemsByQualification,
  getYearItemsByQualificationAndGrade,
  getCategoryItemsByGradeAndYear,
  getCurrentQuestionItems,
} from "@/features/menu/lib/getQuizMenuItems";
import {
  fetchGetAllQualifications,
  fetchGetGradesByQualification,
  fetchGetYearsByQualificationAndGrade,
  fetchGetCategories,
  fetchGetQuestionsByCategory,
} from "@/lib/api";
import { client } from "@/lib/client";
import { ALL_CATEGORY } from "@/lib/constants";

// モックの設定
jest.mock("@/lib/api", () => ({
  fetchGetAllQualifications: jest.fn(),
  fetchGetGradesByQualification: jest.fn(),
  fetchGetYearsByQualificationAndGrade: jest.fn(),
  fetchGetCategories: jest.fn(),
  fetchGetQuestionsByCategory: jest.fn(),
}));

const mockFetchGetAllQualifications = fetchGetAllQualifications as jest.Mock;
const mockFetchGetGradesByQualification =
  fetchGetGradesByQualification as jest.Mock;
const mockFetchGetYearsByQualificationAndGrade =
  fetchGetYearsByQualificationAndGrade as jest.Mock;
const mockFetchGetCategories = fetchGetCategories as jest.Mock;
const mockFetchGetQuestionsByCategory =
  fetchGetQuestionsByCategory as jest.Mock;

describe("Menu Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("parseQuizCurrentUrl", () => {
    test("正しいURLから資格、級、年度、カテゴリをパースできる", () => {
      const url = "/quiz/testQualification/testGrade/2024/testCategory/1";
      const result = parseQuizCurrentUrl(url);
      expect(result).toEqual({
        qualification: "testQualification",
        grade: "testGrade",
        year: "2024",
        category: "testCategory",
      });
    });

    test("無効なURLの場合はnullを返す", () => {
      const url = "/invalid/url/format";
      const result = parseQuizCurrentUrl(url);
      expect(result).toBeNull();
    });
  });

  describe("getQualificationItems", () => {
    test("資格ごとのメニュー項目を取得", async () => {
      mockFetchGetAllQualifications.mockResolvedValue(["資格A", "資格B"]);
      mockFetchGetGradesByQualification.mockResolvedValue(["1級"]);
      mockFetchGetYearsByQualificationAndGrade.mockResolvedValue(["2024"]);
      mockFetchGetCategories.mockResolvedValue(["カテゴリA", "カテゴリB"]);

      const result = await getQualificationItems();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        name: "資格A",
        href: client.quiz._qualification("資格A").$url().path,
        children: expect.any(Array),
      });
      expect(result[1]).toEqual({
        name: "資格B",
        href: client.quiz._qualification("資格B").$url().path,
        children: expect.any(Array),
      });
    });
  });

  describe("getGradeItemsByQualification", () => {
    test("級ごとのメニュー項目を取得", async () => {
      mockFetchGetGradesByQualification.mockResolvedValue(["1級", "2級"]);
      mockFetchGetYearsByQualificationAndGrade.mockResolvedValue(["2024"]);
      mockFetchGetCategories.mockResolvedValue(["カテゴリA", "カテゴリB"]);

      const result = await getGradeItemsByQualification("資格A");

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        name: "1級",
        href: client.quiz._qualification("資格A")._grade("1級").$url().path,
        children: expect.any(Array),
      });
    });
  });

  describe("getYearItemsByQualificationAndGrade", () => {
    test("年度ごとのメニュー項目を取得", async () => {
      mockFetchGetYearsByQualificationAndGrade.mockResolvedValue([
        "2023",
        "2024",
      ]);
      mockFetchGetCategories.mockResolvedValue(["カテゴリA"]);

      const result = await getYearItemsByQualificationAndGrade("資格A", "1級");

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        name: "2023",
        href: client.quiz
          ._qualification("資格A")
          ._grade("1級")
          ._year(2023)
          .$url().path,
        children: expect.any(Array),
      });
    });
  });

  describe("getCategoryItemsByGradeAndYear", () => {
    test("カテゴリごとのメニュー項目を取得", async () => {
      mockFetchGetCategories.mockResolvedValue(["カテゴリA", "カテゴリB"]);

      const result = await getCategoryItemsByGradeAndYear(
        "資格A",
        "1級",
        "2023",
      );

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        name: "全ての問題",
        href: client.quiz
          ._qualification("資格A")
          ._grade("1級")
          ._year(2023)
          ._category(ALL_CATEGORY)
          .$url().path,
      });
      expect(result[1]).toEqual({
        name: "カテゴリA",
        href: client.quiz
          ._qualification("資格A")
          ._grade("1級")
          ._year(2023)
          ._category("カテゴリA")
          .$url().path,
      });
    });
  });

  describe("getCurrentQuestionItems", () => {
    test("問題ごとのメニュー項目を取得", async () => {
      mockFetchGetQuestionsByCategory.mockResolvedValue([
        { questionId: 1 },
        { questionId: 2 },
      ]);

      const url = "/quiz/資格A/1級/2024/カテゴリA/1";
      const result = await getCurrentQuestionItems(url);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        name: "問題 1",
        href: client.quiz
          ._qualification("資格A")
          ._grade("1級")
          ._year(2024)
          ._category("カテゴリA")
          ._id(1)
          .$url().path,
      });
      expect(result[1]).toEqual({
        name: "問題 2",
        href: client.quiz
          ._qualification("資格A")
          ._grade("1級")
          ._year(2024)
          ._category("カテゴリA")
          ._id(2)
          .$url().path,
      });
    });

    test("無効なURLの場合、空の配列を返す", async () => {
      const url = "/invalid/url/format";
      const result = await getCurrentQuestionItems(url);
      expect(result).toEqual([]);
    });
  });
});
