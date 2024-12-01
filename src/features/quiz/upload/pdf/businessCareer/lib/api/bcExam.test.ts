import {
  cleanText,
  extractQuestionAndOptions,
  parseProblems,
} from "@/features/quiz/upload/pdf/businessCareer/lib/api/bcExam";
import { QuestionData } from "@/types/quizType";

describe("parseProblems", () => {
  const sampleText = `
問題1 物流に関する説明として最も適切なものはどれか。
ア.物流Aに関する説明です。
イ.物流Bに関する説明です。
ウ.物流Cに関する説明です。
エ.物流Dに関する説明です。

問題2 サプライチェーンに関する記述として不適切なものはどれか。
ア.SCMの説明Aです。
イ.SCMの説明Bです。
ウ.SCMの説明Cです。
エ.SCMの説明Dです。
  `;

  it("should correctly parse problems from text", () => {
    const result: QuestionData[] = parseProblems(sampleText);

    // 問題が2つあるか確認
    expect(result.length).toBe(2);

    // 問題1の検証
    expect(result[0].questionId).toBe(1);
    expect(result[0].question.text).toContain(
      "物流に関する説明として最も適切なものはどれか",
    );
    expect(result[0].options.length).toBe(4);
    expect(result[0].options[0].text).toBe("物流Aに関する説明です。");
    expect(result[0].options[1].text).toBe("物流Bに関する説明です。");
    expect(result[0].options[2].text).toBe("物流Cに関する説明です。");
    expect(result[0].options[3].text).toBe("物流Dに関する説明です。");

    // 問題2の検証
    expect(result[1].questionId).toBe(2);
    expect(result[1].question.text).toContain(
      "サプライチェーンに関する記述として不適切なものはどれか",
    );
    expect(result[1].options.length).toBe(4);
    expect(result[1].options[0].text).toBe("SCMの説明Aです。");
    expect(result[1].options[1].text).toBe("SCMの説明Bです。");
    expect(result[1].options[2].text).toBe("SCMの説明Cです。");
    expect(result[1].options[3].text).toBe("SCMの説明Dです。");
  });

  it("should return an empty array if no problems are found", () => {
    const emptyText = "このテキストには問題が含まれていません。";
    const result = parseProblems(emptyText);
    expect(result.length).toBe(0);
  });
});

describe("cleanText", () => {
  it("should remove unwanted patterns from the text", () => {
    const text = "R5前-061B01-1禁転載複製「中央職業能力開発協会編」テスト問題";
    const cleaned = cleanText(text);
    expect(cleaned).toBe("テスト問題");
  });
});

describe("cleanText", () => {
  it("should remove unwanted patterns from the text", () => {
    const text = "R5前-061B01-1禁転載複製「中央職業能力開発協会編」テスト問題";
    const cleaned = cleanText(text);
    expect(cleaned).toBe("テスト問題");
  });
});

describe("extractQuestionAndOptions", () => {
  it("should extract question text and options correctly", () => {
    const content = `
      これは質問文です。
      ア．選択肢A
      イ．選択肢B
      ウ．選択肢C
      エ．選択肢D
    `;
    const { questionText, options } = extractQuestionAndOptions(content);
    expect(questionText).toBe("これは質問文です。");
    expect(options).toEqual([
      { text: "選択肢A" },
      { text: "選択肢B" },
      { text: "選択肢C" },
      { text: "選択肢D" },
    ]);
  });

  it("should handle content with no options", () => {
    const content = "これは質問文だけです。";
    const { questionText, options } = extractQuestionAndOptions(content);
    expect(questionText).toBe("これは質問文だけです。");
    expect(options).toEqual([]);
  });
});
