import prisma from "@/lib/prisma";
import { QuestionData } from "@/@types/quizType";

// 資格一覧を取得
export async function getAllQualifications(): Promise<string[]> {
  const qualifications = await prisma.qualification.findMany({
    select: {
      name: true,
    },
  });
  return qualifications.map((q) => q.name);
}

// 指定した資格の年度一覧を取得
export async function getYearsByQualification(
  qualification: string
): Promise<string[]> {
  const qualificationRecord = await prisma.qualification.findUnique({
    where: { name: qualification },
    select: {
      years: {
        select: {
          year: true,
        },
      },
    },
  });

  if (!qualificationRecord) {
    return [];
  }

  return qualificationRecord.years.map((y) => y.year);
}

// 指定した資格と年度の問題を取得
export async function getQuestions(
  qualification: string,
  year: string
): Promise<QuestionData[]> {
  const questions = await prisma.questionData.findMany({
    where: {
      qualification: {
        name: qualification,
      },
      year: {
        year: year,
      },
    },
    select: {
      id: true,
      questionId: true,
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

// 指定した資格と年度のカテゴリ一覧を取得
export async function getCategories(
  qualification: string,
  year: string
): Promise<string[]> {
  const categories = await prisma.category.findMany({
    where: {
      questions: {
        some: {
          qualification: {
            name: qualification,
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
  });

  return categories.map((c) => c.name);
}

// 指定した資格、年度、カテゴリの問題を取得
export async function getQuestionsByCategory(
  qualification: string,
  year: string,
  categoryName: string
): Promise<QuestionData[]> {
  const questions = await prisma.questionData.findMany({
    where: {
      qualification: {
        name: qualification,
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

// 指定した資格、年度、IDの問題を取得
export async function getQuestionById(
  qualification: string,
  year: string,
  id: number
): Promise<QuestionData | undefined> {
  const qualificationRecord = await prisma.qualification.findUnique({
    where: { name: qualification },
  });

  if (!qualificationRecord) return undefined;

  const yearRecord = await prisma.year.findUnique({
    where: {
      qualificationId_year: {
        qualificationId: qualificationRecord.id,
        year: year,
      },
    },
  });

  if (!yearRecord) return undefined;

  const question = await prisma.questionData.findUnique({
    where: {
      qualificationId_yearId_questionId: {
        qualificationId: qualificationRecord.id,
        yearId: yearRecord.id,
        questionId: id,
      },
    },
    select: {
      id: true,
      questionId: true,
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
  });

  if (!question) {
    return undefined;
  }

  return {
    id: question.id,
    questionId: question.questionId,
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

// 問題データを保存（資格、年度ごと）
export async function saveQuestions(
  qualificationName: string,
  yearValue: string,
  questionsData: QuestionData[]
): Promise<boolean> {
  try {
    await prisma.$transaction(async (prisma) => {
      // 資格のアップサート
      const qualification = await prisma.qualification.upsert({
        where: { name: qualificationName },
        create: { name: qualificationName },
        update: {},
      });

      // 年度のアップサート
      const year = await prisma.year.upsert({
        where: {
          qualificationId_year: {
            qualificationId: qualification.id,
            year: yearValue,
          },
        },
        create: {
          qualificationId: qualification.id,
          year: yearValue,
        },
        update: {},
      });

      // カテゴリーのキャッシュを作成
      const categoryCache = new Map<string, { id: number }>();

      // 質問データの保存
      for (const questionData of questionsData) {
        // カテゴリーの取得または作成
        let categoryRecord = categoryCache.get(questionData.category);
        if (!categoryRecord) {
          // カテゴリーをアップサート
          const category = await prisma.category.upsert({
            where: { name: questionData.category },
            create: { name: questionData.category },
            update: {},
          });
          categoryCache.set(questionData.category, { id: category.id });
          categoryRecord = { id: category.id };
        }

        // 既存のQuestionDataを確認
        const existingQuestion = await prisma.questionData.findUnique({
          where: {
            qualificationId_yearId_questionId: {
              qualificationId: qualification.id,
              yearId: year.id,
              questionId: questionData.questionId,
            },
          },
          include: {
            question: true, // questionContent
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
          await prisma.mediaContent.update({
            where: { id: existingQuestion.questionContentId },
            data: {
              text: questionData.question.text,
              image: questionData.question.image,
            },
          });

          // 解説の更新または作成
          if (questionData.explanation) {
            if (existingQuestion.explanationId) {
              // 既存の解説を更新
              await prisma.mediaContent.update({
                where: { id: existingQuestion.explanationId },
                data: {
                  text: questionData.explanation.text,
                  image: questionData.explanation.image,
                },
              });
            } else {
              // 新しい解説を作成
              const explanationContent = await prisma.mediaContent.create({
                data: {
                  text: questionData.explanation.text,
                  image: questionData.explanation.image,
                },
              });
              await prisma.questionData.update({
                where: { id: existingQuestion.id },
                data: {
                  explanationId: explanationContent.id,
                },
              });
            }
          } else if (existingQuestion.explanationId) {
            // 既存の解説を削除
            await prisma.mediaContent.delete({
              where: { id: existingQuestion.explanationId },
            });
            await prisma.questionData.update({
              where: { id: existingQuestion.id },
              data: {
                explanationId: null,
              },
            });
          }

          // QuestionDataの更新
          await prisma.questionData.update({
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
            await prisma.mediaContent.deleteMany({
              where: { id: { in: optionExplanationIds } },
            });
          }

          if (optionIds.length > 0) {
            await prisma.questionOption.deleteMany({
              where: { id: { in: optionIds } },
            });
          }

          // 新しいオプションを作成
          for (const optionData of questionData.options) {
            // オプションの解説を作成（存在する場合）
            let optionExplanationContent = null;
            if (optionData.explanation) {
              optionExplanationContent = await prisma.mediaContent.create({
                data: {
                  text: optionData.explanation.text,
                  image: optionData.explanation.image,
                },
              });
            }

            // QuestionOptionの作成
            await prisma.questionOption.create({
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
          const questionContent = await prisma.mediaContent.create({
            data: {
              text: questionData.question.text,
              image: questionData.question.image,
            },
          });

          // 解説のMediaContentを作成（存在する場合）
          let explanationContent = null;
          if (questionData.explanation) {
            explanationContent = await prisma.mediaContent.create({
              data: {
                text: questionData.explanation.text,
                image: questionData.explanation.image,
              },
            });
          }

          // 新しいQuestionDataを作成
          const questionRecord = await prisma.questionData.create({
            data: {
              questionId: questionData.questionId,
              categoryId: categoryRecord.id,
              questionContentId: questionContent.id,
              answer: questionData.answer,
              explanationId: explanationContent ? explanationContent.id : null,
              qualificationId: qualification.id,
              yearId: year.id,
            },
          });

          // オプションの保存
          for (const optionData of questionData.options) {
            // オプションの解説を作成（存在する場合）
            let optionExplanationContent = null;
            if (optionData.explanation) {
              optionExplanationContent = await prisma.mediaContent.create({
                data: {
                  text: optionData.explanation.text,
                  image: optionData.explanation.image,
                },
              });
            }

            // QuestionOptionの作成
            await prisma.questionOption.create({
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
    });
    return true;
  } catch (error) {
    console.error("Error saving questions:", error);
    return false;
  }
}

// 指定した資格と年度のデータが存在するかチェックする
export async function existsData(
  qualification: string,
  year: string
): Promise<boolean> {
  const count = await prisma.questionData.count({
    where: {
      qualification: {
        name: qualification,
      },
      year: {
        year: year,
      },
    },
  });
  return count > 0;
}

export async function updateQuestionAnswer(
  qualificationId: number,
  yearId: number,
  questionId: number,
  answer: number
) {
  await prisma.questionData.update({
    where: {
      qualificationId_yearId_questionId: {
        qualificationId,
        yearId,
        questionId,
      },
    },
    data: {
      answer: answer,
    },
  });
}

export async function getQualificationAndYearIds(
  qualification: string,
  year: string
): Promise<{ qualificationId: number; yearId: number }> {
  const qualificationRecord = await prisma.qualification.findUnique({
    where: { name: qualification },
  });

  if (!qualificationRecord) {
    throw new Error(`Qualification ${qualification} not found.`);
  }

  const yearRecord = await prisma.year.findUnique({
    where: {
      qualificationId_year: {
        qualificationId: qualificationRecord.id,
        year: year,
      },
    },
  });

  if (!yearRecord) {
    throw new Error(
      `Year ${year} for qualification ${qualification} not found.`
    );
  }

  return {
    qualificationId: qualificationRecord.id,
    yearId: yearRecord.id,
  };
}