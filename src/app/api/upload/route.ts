import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const qualification = formData.get("qualification") as string;
  const year = formData.get("year") as string;

  if (!file || !qualification || !year) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const content = await file.text();
  const questions = JSON.parse(content);

  const dirPath = path.join(process.cwd(), "data", qualification);
  await fs.mkdir(dirPath, { recursive: true });

  const filePath = path.join(dirPath, `${year}.json`);
  await fs.writeFile(filePath, JSON.stringify(questions, null, 2), "utf8");

  return NextResponse.json({ message: "Questions uploaded successfully" });
}
