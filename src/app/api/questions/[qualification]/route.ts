import { getGradesByQualification } from "@/services/quizService";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { qualification: string };
  }
) {
  const { qualification } = params;
  const grades = await getGradesByQualification(qualification);

  if (!grades) {
    return NextResponse.json({ error: "Grades not found" }, { status: 404 });
  }

  return NextResponse.json(grades);
}
