import { NextResponse } from "next/server";
import { getCategories } from "@/services/quizService";

type Params = Promise<{
  qualification: string;
  grade: string;
  year: string;
}>;

export async function GET(request: Request, segmentData: { params: Params }) {
  const params = await segmentData.params;
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
