import {
  modifyGradeText,
  extractCategories,
  extractSections,
  extractAnswersFromSection,
  parseAnsData,
  cleanSectionText,
} from "@/features/businessCareer/api/bcAns";

describe("bcUtils tests", () => {
  describe("modifyGradeText", () => {
    it("should modify grade text correctly", () => {
      const input = "【2級人事・人材開発】";
      const expectedOutput = "2級_人事・人材開発";
      expect(modifyGradeText(input)).toBe(expectedOutput);
    });
  });

  describe("extractCategories", () => {
    it("should extract categories from text", () => {
      const text = "【2級人事・人材開発】\n問題1\n【1級 経営戦略】\n問題2";
      const categories = extractCategories(text);
      expect(categories).toEqual([
        { title: "【2級人事・人材開発】", startIndex: 0 },
        { title: "【1級 経営戦略】", startIndex: 16 },
      ]);
    });
  });

  describe("extractSections", () => {
    it("should extract sections correctly", () => {
      const text = "【2級人事・人材開発】\n問題1\n【1級 経営戦略】\n問題2";
      const sections = extractSections(text);
      expect(sections).toEqual([
        {
          category: "【2級人事・人材開発】",
          sectionText: "【2級人事・人材開発】\n問題1\n",
        },
        {
          category: "【1級 経営戦略】",
          sectionText: "【1級 経営戦略】\n問題2",
        },
      ]);
    });
  });

  describe("extractAnswersFromSection", () => {
    it("should extract answers from section", () => {
      const sectionText = "1 アイ\n2 ウエ\n3オイ";
      const answers = extractAnswersFromSection(sectionText);

      expect(answers).toEqual([
        { questionNumber: 1, answer: "ア" },
        { questionNumber: 4, answer: "イ" },
        { questionNumber: 2, answer: "ウ" },
        { questionNumber: 5, answer: "エ" },
        { questionNumber: 3, answer: "オ" },
        { questionNumber: 6, answer: "イ" },
      ]);
    });
  });

  describe("parseAnsData", () => {
    it("should parse exam data correctly", () => {
      const text =
        "令和3年度 後期 ビジネスキャリア検定試験\n【2級人事・人材開発】\n1 アイ\n2 ウエ\n（注）注意事項\n【1級 経営戦略】\n3 イウ";
      const examData = parseAnsData(text);
      expect(examData).toEqual({
        year: "令和3年度 後期",
        categories: [
          {
            category: "【2級人事・人材開発】",
            answers: [
              { questionNumber: 1, answer: "ア" },
              { questionNumber: 3, answer: "イ" },
              { questionNumber: 2, answer: "ウ" },
              { questionNumber: 4, answer: "エ" },
            ],
          },
          {
            category: "【1級 経営戦略】",
            answers: [
              { questionNumber: 3, answer: "イ" },
              { questionNumber: 6, answer: "ウ" },
            ],
          },
        ],
      });
    });
  });

  describe("cleanSectionText", () => {
    it("should clean section text by removing unnecessary parts", () => {
      const sectionText =
        "【３級人事・人材開発】\n1エイ\n2アエ （注）この問題はサンプルです";
      const cleanedText = cleanSectionText(sectionText);
      expect(cleanedText).toBe("【３級人事・人材開発】\n1エイ\n2アエ");
    });
  });
});
