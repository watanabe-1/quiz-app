import {
  extractYear,
  extractTitle,
  extractGradeAndQualification,
  convertToHalfWidth,
  convertSingleKatakanaToNumber,
  replaceSpacesWithUnderscore,
} from "@/features/businessCareer/api/bcUtils";

// Mock katakanaToNumbersMap
jest.mock("@/lib/constants", () => ({
  katakanaToNumbersMap: new Map([
    ["イチ", 1],
    ["ニ", 2],
    ["サン", 3],
  ]),
}));

describe("extractYear", () => {
  it("should extract and convert year with era", () => {
    expect(extractYear("令和3年度 前期")).toBe("令和3年度 前期");
    expect(extractYear("平成29年度 後期")).toBe("平成29年度 後期");
  });

  it("should handle full-width numbers", () => {
    expect(extractYear("令和３年度 前期")).toBe("令和3年度 前期");
  });

  it("should return null if no year is found", () => {
    expect(extractYear("テスト")).toBeNull();
  });
});

describe("extractTitle", () => {
  it("should extract and convert title", () => {
    expect(extractTitle("2級 試験問題")).toBe("2級 試験問題");
    expect(extractTitle("３級テスト")).toBe("3級テスト");
  });

  it("should handle full-width numbers", () => {
    expect(extractTitle("３級 テスト")).toBe("3級 テスト");
  });

  it("should return null if no title is found", () => {
    expect(extractTitle("テスト")).toBeNull();
  });
});

describe("extractGradeAndQualification", () => {
  it("should extract grade and qualification", () => {
    expect(extractGradeAndQualification("2級_テスト試験")).toEqual({
      grade: "2級",
      qualification: "テスト試験",
    });
  });

  it("should return null if format is incorrect", () => {
    expect(extractGradeAndQualification("テスト_試験")).toBeNull();
  });
});

describe("convertToHalfWidth", () => {
  it("should convert full-width numbers to half-width", () => {
    expect(convertToHalfWidth("令和３年度")).toBe("令和3年度");
    expect(convertToHalfWidth("平成２９年度")).toBe("平成29年度");
  });

  it("should not change half-width characters", () => {
    expect(convertToHalfWidth("令和3年度")).toBe("令和3年度");
  });
});

describe("convertSingleKatakanaToNumber", () => {
  it("should convert single katakana to number", () => {
    expect(convertSingleKatakanaToNumber("イチ")).toBe(1);
    expect(convertSingleKatakanaToNumber("ニ")).toBe(2);
    expect(convertSingleKatakanaToNumber("サン")).toBe(3);
  });

  it("should return null for unknown katakana", () => {
    expect(convertSingleKatakanaToNumber("シ")).toBeNull();
  });
});

describe("replaceSpacesWithUnderscore", () => {
  it("should replace spaces with underscores", () => {
    expect(replaceSpacesWithUnderscore("テスト 試験")).toBe("テスト_試験");
    expect(replaceSpacesWithUnderscore("テスト　試験")).toBe("テスト_試験"); // 全角スペース
    expect(replaceSpacesWithUnderscore(" テスト ")).toBe("_テスト_");
  });

  it("should handle empty strings", () => {
    expect(replaceSpacesWithUnderscore("")).toBe("");
  });
});
