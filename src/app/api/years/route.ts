import { NextRequest, NextResponse } from "next/server";
import { getYearsByQualificationAndGrade } from "@/services/quizService";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const qualification = searchParams.get("qualification");
  const grade = searchParams.get("grade");

  if (!qualification || !grade) {
    return NextResponse.json(
      { error: "Qualification and grade parameters are required" },
      { status: 400 }
    );
  }

  try {
    const years = await getYearsByQualificationAndGrade(qualification, grade);
    return NextResponse.json(years);
  } catch (error) {
    console.error("Error fetching years:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
