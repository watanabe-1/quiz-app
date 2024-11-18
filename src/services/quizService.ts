import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { QuestionData } from "@/types/quizType";

// 資格一覧を取得
export async function getAllQualifications(): Promise<string[]> {
  const qualifications = await prisma.qualification.findMany({
    select: {
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });
  return qualifications.map((q) => q.name);
}

// 指定した資格の級一覧を取得
export async function getGradesByQualification(
  qualification: string,
): Promise<string[]> {
  const grades = await prisma.grade.findMany({
    where: {
      questions: {
        some: {
          qualification: {
            name: qualification,
          },
        },
      },
    },
    select: {
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return grades.map((g) => g.name);
}

// 指定した資格、級の年度一覧を取得
export async function getYearsByQualificationAndGrade(
  qualification: string,
  grade: string,
): Promise<string[]> {
  const years = await prisma.year.findMany({
    where: {
      questions: {
        some: {
          qualification: {
            name: qualification,
          },
          grade: {
            name: grade,
          },
        },
      },
    },
    select: {
      year: true,
    },
    orderBy: {
      year: "asc",
    },
  });

  return years.map((y) => y.year);
}

// 指定した資格、級、年度の問題を取得
export async function getQuestions(
  qualification: string,
  grade: string,
  year: string,
): Promise<QuestionData[]> {
  const questions = await prisma.questionData.findMany({
    where: {
      qualification: {
        name: qualification,
      },
      grade: {
        name: grade,
      },
      year: {
        year: year,
      },
    },
    select: {
      id: true,
      questionId: true,
      qualification: {
        select: {
          name: true,
        },
      },
      grade: {
        select: {
          name: true,
        },
      },
      year: {
        select: {
          year: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
      answer: true,
      question: true, // MediaContent
      explanation: true, // MediaContent
      options: {
        include: {
          explanation: true, // MediaContent
        },
      },
    },
    orderBy: {
      questionId: "asc",
    },
  });

  // PrismaのデータをQuestionData型に変換
  return questions.map((q) => ({
    id: q.id,
    questionId: q.questionId,
    qualification: q.qualification.name,
    grade: q.grade.name,
    year: q.year.year,
    category: q.category.name,
    question: {
      id: q.question?.id,
      text: q.question?.text || undefined,
      image: q.question?.image || undefined,
    },
    options: q.options.map((o) => ({
      id: o.id,
      text: o.text,
      image: o.image || undefined,
      explanation: o.explanation
        ? {
            id: o.explanation.id,
            text: o.explanation.text || undefined,
            image: o.explanation.image || undefined,
          }
        : undefined,
    })),
    answer: q.answer,
    explanation: q.explanation
      ? {
          id: q.explanation.id,
          text: q.explanation.text || undefined,
          image: q.explanation.image || undefined,
        }
      : undefined,
  }));
}

// 指定した資格、級、年度のカテゴリ一覧を取得
export async function getCategories(
  qualification: string,
  grade: string,
  year: string,
): Promise<string[]> {
  const categories = await prisma.category.findMany({
    where: {
      questions: {
        some: {
          qualification: {
            name: qualification,
          },
          grade: {
            name: grade,
          },
          year: {
            year: year,
          },
        },
      },
    },
    select: {
      name: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  return categories.map((c) => c.name);
}

// 指定した資格、級、年度、カテゴリの問題を取得
export async function getQuestionsByCategory(
  qualification: string,
  grade: string,
  year: string,
  categoryName: string,
): Promise<QuestionData[]> {
  const questions = await prisma.questionData.findMany({
    where: {
      qualification: {
        name: qualification,
      },
      grade: {
        name: grade,
      },
      year: {
        year: year,
      },
      category: {
        name: categoryName,
      },
    },
    select: {
      id: true,
      questionId: true,
      qualification: {
        select: {
          name: true,
        },
      },
      grade: {
        select: {
          name: true,
        },
      },
      year: {
        select: {
          year: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
      answer: true,
      question: true,
      explanation: true,
      options: {
        include: {
          explanation: true,
        },
      },
    },
    orderBy: {
      questionId: "asc",
    },
  });

  return questions.map((q) => ({
    id: q.id,
    questionId: q.questionId,
    qualification: q.qualification.name,
    grade: q.grade.name,
    year: q.year.year,
    category: q.category.name,
    question: {
      id: q.question?.id,
      text: q.question?.text || undefined,
      image: q.question?.image || undefined,
    },
    options: q.options.map((o) => ({
      id: o.id,
      text: o.text,
      image: o.image || undefined,
      explanation: o.explanation
        ? {
            id: o.explanation.id,
            text: o.explanation.text || undefined,
            image: o.explanation.image || undefined,
          }
        : undefined,
    })),
    answer: q.answer,
    explanation: q.explanation
      ? {
          id: q.explanation.id,
          text: q.explanation.text || undefined,
          image: q.explanation.image || undefined,
        }
      : undefined,
  }));
}

// 指定した資格、級、年度、IDの問題を取得
export async function getQuestionById(
  qualification: string,
  grade: string,
  year: string,
  id: number,
): Promise<QuestionData | undefined> {
  const question = await prisma.questionData.findFirst({
    where: {
      qualification: {
        name: qualification,
      },
      grade: {
        name: grade,
      },
      year: {
        year: year,
      },
      questionId: id,
    },
    select: {
      id: true,
      questionId: true,
      qualification: {
        select: {
          name: true,
        },
      },
      grade: {
        select: {
          name: true,
        },
      },
      year: {
        select: {
          year: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
      answer: true,
      question: true,
      explanation: true,
      options: {
        include: {
          explanation: true,
        },
      },
    },
    orderBy: {
      questionId: "asc",
    },
  });

  if (!question) {
    return undefined;
  }

  return {
    id: question.id,
    questionId: question.questionId,
    qualification: question.qualification.name,
    grade: question.grade.name,
    year: question.year.year,
    category: question.category.name,
    question: {
      id: question.question?.id,
      text: question.question?.text || undefined,
      image: question.question?.image || undefined,
    },
    options: question.options.map((o) => ({
      id: o.id,
      text: o.text,
      image: o.image || undefined,
      explanation: o.explanation
        ? {
            id: o.explanation.id,
            text: o.explanation.text || undefined,
            image: o.explanation.image || undefined,
          }
        : undefined,
    })),
    answer: question.answer,
    explanation: question.explanation
      ? {
          id: question.explanation.id,
          text: question.explanation.text || undefined,
          image: question.explanation.image || undefined,
        }
      : undefined,
  };
}

// 資格の取得または作成
async function getOrCreateQualification(
  prismaClient: Prisma.TransactionClient,
  qualificationName: string,
) {
  return await prismaClient.qualification.upsert({
    where: { name: qualificationName },
    create: { name: qualificationName },
    update: {},
  });
}

// 級の取得または作成
async function getOrCreateGrade(
  prismaClient: Prisma.TransactionClient,
  gradeName: string,
) {
  return await prismaClient.grade.upsert({
    where: { name: gradeName },
    create: { name: gradeName },
    update: {},
  });
}

// 年度の取得または作成
async function getOrCreateYear(
  prismaClient: Prisma.TransactionClient,
  yearValue: string,
) {
  return await prismaClient.year.upsert({
    where: { year: yearValue },
    create: { year: yearValue },
    update: {},
  });
}

// カテゴリーの取得または作成（キャッシュ利用）
async function getOrCreateCategory(
  prismaClient: Prisma.TransactionClient,
  categoryName: string,
  categoryCache: Map<string, { id: number }>,
) {
  if (categoryCache.has(categoryName)) {
    return categoryCache.get(categoryName)!;
  }
  const category = await prismaClient.category.upsert({
    where: { name: categoryName },
    create: { name: categoryName },
    update: {},
  });
  categoryCache.set(categoryName, category);
  return category;
}

// 単一の問題データを処理
async function processQuestionData(
  prismaClient: Prisma.TransactionClient,
  questionData: QuestionData,
  qualificationId: number,
  gradeId: number,
  yearId: number,
  categoryCache: Map<string, { id: number }>,
) {
  // カテゴリーの取得または作成
  const categoryRecord = await getOrCreateCategory(
    prismaClient,
    questionData.category,
    categoryCache,
  );

  // 既存のQuestionDataを確認
  const existingQuestion = await prismaClient.questionData.findUnique({
    where: {
      qualificationId_gradeId_yearId_questionId: {
        qualificationId: qualificationId,
        gradeId: gradeId,
        yearId: yearId,
        questionId: questionData.questionId,
      },
    },
    include: {
      question: true,
      explanation: true,
      options: {
        include: {
          explanation: true,
        },
      },
    },
  });

  if (existingQuestion) {
    // 既存のquestionContentを更新
    await prismaClient.mediaContent.update({
      where: { id: existingQuestion.questionContentId },
      data: {
        text: questionData.question.text,
        image: questionData.question.image,
      },
    });

    // 解説の更新または作成
    if (questionData.explanation) {
      if (existingQuestion.explanationId) {
        await prismaClient.mediaContent.update({
          where: { id: existingQuestion.explanationId },
          data: {
            text: questionData.explanation.text,
            image: questionData.explanation.image,
          },
        });
      } else {
        const explanationContent = await prismaClient.mediaContent.create({
          data: {
            text: questionData.explanation.text,
            image: questionData.explanation.image,
          },
        });
        await prismaClient.questionData.update({
          where: { id: existingQuestion.id },
          data: {
            explanationId: explanationContent.id,
          },
        });
      }
    } else if (existingQuestion.explanationId) {
      await prismaClient.mediaContent.delete({
        where: { id: existingQuestion.explanationId },
      });
      await prismaClient.questionData.update({
        where: { id: existingQuestion.id },
        data: {
          explanationId: null,
        },
      });
    }

    // QuestionDataの更新
    await prismaClient.questionData.update({
      where: { id: existingQuestion.id },
      data: {
        categoryId: categoryRecord.id,
        answer: questionData.answer,
      },
    });

    // 既存のオプションとその解説を削除
    const optionIds = existingQuestion.options.map((option) => option.id);
    const optionExplanationIds = existingQuestion.options
      .filter((option) => option.explanationId)
      .map((option) => option.explanationId!);

    if (optionExplanationIds.length > 0) {
      await prismaClient.mediaContent.deleteMany({
        where: { id: { in: optionExplanationIds } },
      });
    }

    if (optionIds.length > 0) {
      await prismaClient.questionOption.deleteMany({
        where: { id: { in: optionIds } },
      });
    }

    // 新しいオプションを作成
    for (const optionData of questionData.options) {
      let optionExplanationContent = null;
      if (optionData.explanation) {
        optionExplanationContent = await prismaClient.mediaContent.create({
          data: {
            text: optionData.explanation.text,
            image: optionData.explanation.image,
          },
        });
      }

      await prismaClient.questionOption.create({
        data: {
          text: optionData.text,
          image: optionData.image,
          explanationId: optionExplanationContent
            ? optionExplanationContent.id
            : null,
          questionId: existingQuestion.id,
        },
      });
    }
  } else {
    // 新しいquestionContentを作成
    const questionContent = await prismaClient.mediaContent.create({
      data: {
        text: questionData.question.text,
        image: questionData.question.image,
      },
    });

    // 解説のMediaContentを作成（存在する場合）
    let explanationContent = null;
    if (questionData.explanation) {
      explanationContent = await prismaClient.mediaContent.create({
        data: {
          text: questionData.explanation.text,
          image: questionData.explanation.image,
        },
      });
    }

    // 新しいQuestionDataを作成
    const questionRecord = await prismaClient.questionData.create({
      data: {
        questionId: questionData.questionId,
        categoryId: categoryRecord.id,
        questionContentId: questionContent.id,
        answer: questionData.answer,
        explanationId: explanationContent ? explanationContent.id : null,
        qualificationId: qualificationId,
        gradeId: gradeId,
        yearId: yearId,
      },
    });

    // オプションの保存
    for (const optionData of questionData.options) {
      let optionExplanationContent = null;
      if (optionData.explanation) {
        optionExplanationContent = await prismaClient.mediaContent.create({
          data: {
            text: optionData.explanation.text,
            image: optionData.explanation.image,
          },
        });
      }

      await prismaClient.questionOption.create({
        data: {
          text: optionData.text,
          image: optionData.image,
          explanationId: optionExplanationContent
            ? optionExplanationContent.id
            : null,
          questionId: questionRecord.id,
        },
      });
    }
  }
}

// 問題データを保存（複数の問題）
export async function saveQuestions(
  qualificationName: string,
  gradeName: string,
  yearValue: string,
  questionsData: QuestionData[],
): Promise<boolean> {
  try {
    await prisma.$transaction(
      async (prismaClient: Prisma.TransactionClient) => {
        const qualification = await getOrCreateQualification(
          prismaClient,
          qualificationName,
        );
        const grade = await getOrCreateGrade(prismaClient, gradeName);
        const year = await getOrCreateYear(prismaClient, yearValue);

        const categoryCache = new Map<string, { id: number }>();

        for (const questionData of questionsData) {
          await processQuestionData(
            prismaClient,
            questionData,
            qualification.id,
            grade.id,
            year.id,
            categoryCache,
          );
        }
      },
      {
        maxWait: 5000,
        timeout: 10000,
      },
    );
    return true;
  } catch (error) {
    console.error("Error saving questions:", error);
    return false;
  }
}

// 単一の問題データを更新
export async function saveQuestion(
  qualificationName: string,
  gradeName: string,
  yearValue: string,
  questionData: QuestionData,
): Promise<boolean> {
  try {
    await prisma.$transaction(
      async (prismaClient: Prisma.TransactionClient) => {
        const qualification = await getOrCreateQualification(
          prismaClient,
          qualificationName,
        );
        const grade = await getOrCreateGrade(prismaClient, gradeName);
        const year = await getOrCreateYear(prismaClient, yearValue);

        const categoryCache = new Map<string, { id: number }>();

        await processQuestionData(
          prismaClient,
          questionData,
          qualification.id,
          grade.id,
          year.id,
          categoryCache,
        );
      },
      {
        maxWait: 5000,
        timeout: 10000,
      },
    );
    return true;
  } catch (error) {
    console.error("Error updating question:", error);
    return false;
  }
}

// 指定した資格、級、年度のデータが存在するかチェックする
export async function existsData(
  qualification: string,
  grade: string,
  year: string,
): Promise<boolean> {
  const count = await prisma.questionData.count({
    where: {
      qualification: {
        name: qualification,
      },
      grade: {
        name: grade,
      },
      year: {
        year: year,
      },
    },
  });
  return count > 0;
}

// 指定した資格、級、年度, 問題番号のデータが存在するかチェックする
export async function existsQuestion(
  qualification: string,
  grade: string,
  year: string,
  questionId: number,
): Promise<boolean> {
  const count = await prisma.questionData.count({
    where: {
      qualification: {
        name: qualification,
      },
      grade: {
        name: grade,
      },
      year: {
        year: year,
      },
      questionId: questionId,
    },
  });
  return count > 0;
}

export async function updateQuestionAnswer(
  qualificationName: string,
  gradeName: string,
  yearValue: string,
  questionId: number,
  answer: number,
) {
  await prisma.questionData.updateMany({
    where: {
      qualification: {
        name: qualificationName,
      },
      grade: {
        name: gradeName,
      },
      year: {
        year: yearValue,
      },
      questionId: questionId,
    },
    data: {
      answer: answer,
    },
  });
}
