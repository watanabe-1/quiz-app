import { NextResponse } from "next/server";
import { getAllQualifications } from "@/services/quizService";

export async function GET() {
  try {
    const qualifications = await getAllQualifications();
    return NextResponse.json(qualifications);
  } catch (error) {
    console.error("Error fetching qualifications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
