import { getYearsByQualificationAndGrade } from "@/services/quizService";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { qualification: string; grade: string };
  }
) {
  const { qualification, grade } = params;
  const years = await getYearsByQualificationAndGrade(qualification, grade);

  if (!years) {
    return NextResponse.json({ error: "Years not found" }, { status: 404 });
  }

  return NextResponse.json(years);
}
