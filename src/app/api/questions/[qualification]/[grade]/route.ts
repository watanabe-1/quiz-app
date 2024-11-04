import { NextResponse } from "next/server";
import { getYearsByQualificationAndGrade } from "@/services/quizService";

type Params = Promise<{
  qualification: string;
  grade: string;
}>;

export async function GET(request: Request, segmentData: { params: Params }) {
  const params = await segmentData.params;
  const { qualification, grade } = params;
  const years = await getYearsByQualificationAndGrade(qualification, grade);

  if (!years) {
    return NextResponse.json({ error: "Years not found" }, { status: 404 });
  }

  return NextResponse.json(years);
}
