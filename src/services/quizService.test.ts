import prisma from "@/lib/prisma";
import {
  getAllQualifications,
  getGradesByQualification,
  getYearsByQualificationAndGrade,
  getQuestions,
  getCategories,
  getQuestionsByCategory,
  getQuestionById,
  saveQuestions,
  existsData,
  existsQuestion,
  updateQuestionAnswer,
  saveQuestion,
} from "@/services/quizService";

describe("quizService", () => {
  beforeAll(async () => {
    // テストデータベースをクリーンアップ
    await prisma.questionOption.deleteMany({});
    await prisma.questionData.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.mediaContent.deleteMany({});
    await prisma.grade.deleteMany({});
    await prisma.year.deleteMany({});
    await prisma.qualification.deleteMany({});
  });

  afterAll(async () => {
    // Prismaクライアントを切断
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // 各テストの前にデータベースをクリーンアップ
    await prisma.questionOption.deleteMany({});
    await prisma.questionData.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.mediaContent.deleteMany({});
    await prisma.grade.deleteMany({});
    await prisma.year.deleteMany({});
    await prisma.qualification.deleteMany({});
  });

  test("getAllQualifications should return an empty array when no data exists", async () => {
    const qualifications = await getAllQualifications();
    expect(qualifications).toEqual([]);
  });

  test("saveQuestions should save questions and getAllQualifications should return the qualification", async () => {
    const qualificationName = "テスト資格";
    const gradeName = "1級";
    const yearValue = "2021";

    const questionData = [
      {
        questionId: 1,
        category: "カテゴリーA",
        question: {
          text: "2 + 2 は何ですか？",
        },
        options: [{ text: "3" }, { text: "4" }, { text: "5" }],
        answer: 1,
        qualification: qualificationName,
        grade: gradeName,
        year: yearValue,
      },
    ];

    const saveResult = await saveQuestions(
      qualificationName,
      gradeName,
      yearValue,
      questionData,
    );
    expect(saveResult).toBe(true);

    const qualifications = await getAllQualifications();
    expect(qualifications).toEqual([qualificationName]);
  });

  test("getGradesByQualification should return correct grades", async () => {
    const qualificationName = "テスト資格";
    const gradeName1 = "1級";
    const gradeName2 = "2級";
    const yearValue = "2021";

    const questionData1 = [
      {
        questionId: 1,
        category: "カテゴリーA",
        question: {
          text: "2 + 2 は何ですか？",
        },
        options: [{ text: "3" }, { text: "4" }, { text: "5" }],
        answer: 1,
        qualification: qualificationName,
        grade: gradeName1,
        year: yearValue,
      },
    ];

    const questionData2 = [
      {
        questionId: 2,
        category: "カテゴリーB",
        question: {
          text: "3 + 3 は何ですか？",
        },
        options: [{ text: "5" }, { text: "6" }, { text: "7" }],
        answer: 1,
        qualification: qualificationName,
        grade: gradeName2,
        year: yearValue,
      },
    ];

    await saveQuestions(
      qualificationName,
      gradeName1,
      yearValue,
      questionData1,
    );
    await saveQuestions(
      qualificationName,
      gradeName2,
      yearValue,
      questionData2,
    );

    const grades = await getGradesByQualification(qualificationName);
    expect(grades).toEqual(expect.arrayContaining([gradeName1, gradeName2]));
  });

  test("getYearsByQualificationAndGrade should return correct years", async () => {
    const qualificationName = "テスト資格";
    const gradeName = "1級";
    const yearValue1 = "2020";
    const yearValue2 = "2021";

    const questionData1 = [
      {
        questionId: 1,
        category: "カテゴリーA",
        question: {
          text: "1 + 1 は何ですか？",
        },
        options: [{ text: "1" }, { text: "2" }, { text: "3" }],
        answer: 1,
        qualification: qualificationName,
        grade: gradeName,
        year: yearValue1,
      },
    ];

    const questionData2 = [
      {
        questionId: 2,
        category: "カテゴリーB",
        question: {
          text: "2 + 2 は何ですか？",
        },
        options: [{ text: "3" }, { text: "4" }, { text: "5" }],
        answer: 1,
        qualification: qualificationName,
        grade: gradeName,
        year: yearValue2,
      },
    ];

    await saveQuestions(
      qualificationName,
      gradeName,
      yearValue1,
      questionData1,
    );
    await saveQuestions(
      qualificationName,
      gradeName,
      yearValue2,
      questionData2,
    );

    const years = await getYearsByQualificationAndGrade(
      qualificationName,
      gradeName,
    );
    expect(years).toEqual(expect.arrayContaining([yearValue1, yearValue2]));
  });

  test("getQuestions should return correct questions", async () => {
    const qualificationName = "テスト資格";
    const gradeName = "1級";
    const yearValue = "2021";

    const questionData = [
      {
        questionId: 1,
        category: "カテゴリーA",
        question: {
          text: "2 + 2 は何ですか？",
        },
        options: [{ text: "3" }, { text: "4" }, { text: "5" }],
        answer: 1,
        qualification: qualificationName,
        grade: gradeName,
        year: yearValue,
      },
      {
        questionId: 2,
        category: "カテゴリーB",
        question: {
          text: "3 + 3 は何ですか？",
        },
        options: [{ text: "5" }, { text: "6" }, { text: "7" }],
        answer: 1,
        qualification: qualificationName,
        grade: gradeName,
        year: yearValue,
      },
    ];

    await saveQuestions(qualificationName, gradeName, yearValue, questionData);

    const questions = await getQuestions(
      qualificationName,
      gradeName,
      yearValue,
    );

    expect(questions.length).toBe(2);

    expect(questions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          questionId: 1,
          category: "カテゴリーA",
          question: expect.objectContaining({
            text: "2 + 2 は何ですか？",
          }),
          options: expect.arrayContaining([
            expect.objectContaining({ text: "3" }),
            expect.objectContaining({ text: "4" }),
            expect.objectContaining({ text: "5" }),
          ]),
          answer: 1,
        }),
        expect.objectContaining({
          questionId: 2,
          category: "カテゴリーB",
          question: expect.objectContaining({
            text: "3 + 3 は何ですか？",
          }),
          options: expect.arrayContaining([
            expect.objectContaining({ text: "5" }),
            expect.objectContaining({ text: "6" }),
            expect.objectContaining({ text: "7" }),
          ]),
          answer: 1,
        }),
      ]),
    );
  });

  test("getCategories should return correct categories", async () => {
    const qualificationName = "テスト資格";
    const gradeName = "1級";
    const yearValue = "2021";

    const questionData = [
      {
        questionId: 1,
        category: "数学",
        question: {
          text: "2 + 2 は何ですか？",
        },
        options: [{ text: "3" }, { text: "4" }, { text: "5" }],
        answer: 1,
        qualification: qualificationName,
        grade: gradeName,
        year: yearValue,
      },
      {
        questionId: 2,
        category: "科学",
        question: {
          text: "H2O は何ですか？",
        },
        options: [{ text: "水" }, { text: "酸素" }, { text: "水素" }],
        answer: 0,
        qualification: qualificationName,
        grade: gradeName,
        year: yearValue,
      },
    ];

    await saveQuestions(qualificationName, gradeName, yearValue, questionData);

    const categories = await getCategories(
      qualificationName,
      gradeName,
      yearValue,
    );
    expect(categories).toEqual(expect.arrayContaining(["数学", "科学"]));
  });

  test("getQuestionsByCategory should return correct questions", async () => {
    const qualificationName = "テスト資格";
    const gradeName = "1級";
    const yearValue = "2021";

    const questionData = [
      {
        questionId: 1,
        category: "数学",
        question: {
          text: "2 + 2 は何ですか？",
        },
        options: [{ text: "3" }, { text: "4" }, { text: "5" }],
        answer: 1,
        qualification: qualificationName,
        grade: gradeName,
        year: yearValue,
      },
      {
        questionId: 2,
        category: "科学",
        question: {
          text: "H2O は何ですか？",
        },
        options: [{ text: "水" }, { text: "酸素" }, { text: "水素" }],
        answer: 0,
        qualification: qualificationName,
        grade: gradeName,
        year: yearValue,
      },
    ];

    await saveQuestions(qualificationName, gradeName, yearValue, questionData);

    const mathQuestions = await getQuestionsByCategory(
      qualificationName,
      gradeName,
      yearValue,
      "数学",
    );
    expect(mathQuestions.length).toBe(1);
    expect(mathQuestions[0].question.text).toBe("2 + 2 は何ですか？");

    const scienceQuestions = await getQuestionsByCategory(
      qualificationName,
      gradeName,
      yearValue,
      "科学",
    );
    expect(scienceQuestions.length).toBe(1);
    expect(scienceQuestions[0].question.text).toBe("H2O は何ですか？");
  });

  test("saveQuestion should update an existing question", async () => {
    const qualificationName = "テスト資格";
    const gradeName = "1級";
    const yearValue = "2021";

    // まず、質問を保存
    const initialQuestionData = {
      questionId: 1,
      category: "数学",
      question: {
        text: "2 + 2 は何ですか？",
      },
      options: [{ text: "3" }, { text: "4" }, { text: "5" }],
      answer: 1,
      qualification: qualificationName,
      grade: gradeName,
      year: yearValue,
    };

    await saveQuestions(qualificationName, gradeName, yearValue, [
      initialQuestionData,
    ]);

    // 質問を更新
    const updatedQuestionData = {
      questionId: 1,
      category: "数学",
      question: {
        text: "2 + 3 は何ですか？", // テキストを変更
      },
      options: [{ text: "4" }, { text: "5" }, { text: "6" }],
      answer: 1,
      qualification: qualificationName,
      grade: gradeName,
      year: yearValue,
    };

    const saveResult = await saveQuestion(
      qualificationName,
      gradeName,
      yearValue,
      updatedQuestionData,
    );
    expect(saveResult).toBe(true);

    const question = await getQuestionById(
      qualificationName,
      gradeName,
      yearValue,
      1,
    );
    expect(question?.question.text).toBe("2 + 3 は何ですか？");
    expect(question?.options).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ text: "4" }),
        expect.objectContaining({ text: "5" }),
        expect.objectContaining({ text: "6" }),
      ]),
    );
  });

  test("saveQuestion should create a new question if it does not exist", async () => {
    const qualificationName = "テスト資格";
    const gradeName = "1級";
    const yearValue = "2021";

    const questionData = {
      questionId: 2,
      category: "科学",
      question: {
        text: "H2O は何ですか？",
      },
      options: [{ text: "水" }, { text: "酸素" }, { text: "水素" }],
      answer: 0,
      qualification: qualificationName,
      grade: gradeName,
      year: yearValue,
    };

    const saveResult = await saveQuestion(
      qualificationName,
      gradeName,
      yearValue,
      questionData,
    );
    expect(saveResult).toBe(true);

    const question = await getQuestionById(
      qualificationName,
      gradeName,
      yearValue,
      2,
    );
    expect(question).not.toBeUndefined();
    expect(question?.question.text).toBe("H2O は何ですか？");
    expect(question?.options.length).toBe(3);
    expect(question?.answer).toBe(0);
  });

  test("getQuestionById should return correct question", async () => {
    const qualificationName = "テスト資格";
    const gradeName = "1級";
    const yearValue = "2021";

    const questionData = [
      {
        questionId: 1,
        category: "数学",
        question: {
          text: "2 + 2 は何ですか？",
        },
        options: [{ text: "3" }, { text: "4" }, { text: "5" }],
        answer: 1,
        qualification: qualificationName,
        grade: gradeName,
        year: yearValue,
      },
    ];

    await saveQuestions(qualificationName, gradeName, yearValue, questionData);

    const question = await getQuestionById(
      qualificationName,
      gradeName,
      yearValue,
      1,
    );
    expect(question).not.toBeUndefined();
    expect(question?.question.text).toBe("2 + 2 は何ですか？");
    expect(question?.options.length).toBe(3);
    expect(question?.answer).toBe(1);
  });

  test("existsData should return true when data exists", async () => {
    const qualificationName = "テスト資格";
    const gradeName = "1級";
    const yearValue = "2021";

    const questionData = [
      {
        questionId: 1,
        category: "数学",
        question: {
          text: "2 + 2 は何ですか？",
        },
        options: [{ text: "3" }, { text: "4" }, { text: "5" }],
        answer: 1,
        qualification: qualificationName,
        grade: gradeName,
        year: yearValue,
      },
    ];

    await saveQuestions(qualificationName, gradeName, yearValue, questionData);

    const exists = await existsData(qualificationName, gradeName, yearValue);
    expect(exists).toBe(true);
  });

  test("existsQuestion should return true when question exists", async () => {
    const qualificationName = "テスト資格";
    const gradeName = "1級";
    const yearValue = "2021";

    const questionData = [
      {
        questionId: 1,
        category: "数学",
        question: {
          text: "2 + 2 は何ですか？",
        },
        options: [{ text: "3" }, { text: "4" }, { text: "5" }],
        answer: 1,
        qualification: qualificationName,
        grade: gradeName,
        year: yearValue,
      },
    ];

    await saveQuestions(qualificationName, gradeName, yearValue, questionData);

    const exists = await existsQuestion(
      qualificationName,
      gradeName,
      yearValue,
      1,
    );
    expect(exists).toBe(true);
  });

  test("updateQuestionAnswer should update the answer", async () => {
    const qualificationName = "テスト資格";
    const gradeName = "1級";
    const yearValue = "2021";

    const questionData = [
      {
        questionId: 1,
        category: "数学",
        question: {
          text: "2 + 2 は何ですか？",
        },
        options: [{ text: "3" }, { text: "4" }, { text: "5" }],
        answer: 0,
        qualification: qualificationName,
        grade: gradeName,
        year: yearValue,
      },
    ];

    await saveQuestions(qualificationName, gradeName, yearValue, questionData);

    await updateQuestionAnswer(qualificationName, gradeName, yearValue, 1, 1);

    const question = await getQuestionById(
      qualificationName,
      gradeName,
      yearValue,
      1,
    );
    expect(question?.answer).toBe(1);
  });
});
