import { NextRequest, NextResponse } from "next/server";
import { getGradesByQualification } from "@/services/quizService";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const qualification = searchParams.get("qualification");

  if (!qualification) {
    return NextResponse.json(
      { error: "Qualification parameter is required" },
      { status: 400 }
    );
  }

  try {
    const grades = await getGradesByQualification(qualification);
    return NextResponse.json(grades);
  } catch (error) {
    console.error("Error fetching grades:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
