import { NextResponse } from "next/server";
import { saveQuestions } from "../../../lib/questions";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const content = await file.text();
  const newQuestions = JSON.parse(content);

  const success = await saveQuestions(newQuestions);

  if (!success) {
    return NextResponse.json(
      { error: "Failed to upload questions" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Questions uploaded successfully" });
}
