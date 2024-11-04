import { NextRequest, NextResponse } from "next/server";
import { getGradesByQualification } from "@/services/quizService";

type Params = Promise<{
  qualification: string;
}>;

export async function GET(_: NextRequest, segmentData: { params: Params }) {
  const params = await segmentData.params;
  const { qualification } = params;
  const grades = await getGradesByQualification(qualification);

  if (!grades) {
    return NextResponse.json({ error: "Grades not found" }, { status: 404 });
  }

  return NextResponse.json(grades);
}
