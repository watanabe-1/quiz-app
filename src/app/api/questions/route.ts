import { getAllQualifications } from "@/services/quizService";
import { NextResponse } from "next/server";

export async function GET() {
  const qualifications = await getAllQualifications();

  if (!qualifications) {
    return NextResponse.json(
      { error: "Qualifications not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(qualifications);
}
