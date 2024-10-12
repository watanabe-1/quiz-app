import { NextResponse } from "next/server";
import { getCategories } from "@/services/quizService";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { qualification: string; grade: string; year: string };
  },
) {
  const { qualification, grade, year } = params;
  const categories = await getCategories(qualification, grade, year);

  if (!categories) {
    return NextResponse.json(
      { error: "Categories not found" },
      { status: 404 },
    );
  }

  return NextResponse.json(categories);
}
