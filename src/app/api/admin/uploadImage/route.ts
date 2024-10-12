import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

function sanitizePathSegment(segment: string): string {
  return segment.replace(/[^a-zA-Z0-9\-_]/g, "_");
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const targetDir = formData.get("targetDir") as string;
  const qualification = formData.get("qualification") as string;
  const year = formData.get("year") as string;

  if (!file || !targetDir || !qualification || !year) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const timestamp = Date.now();
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");

  const safeQualification = sanitizePathSegment(qualification);
  const safeYear = sanitizePathSegment(year);
  const safeTargetDir = sanitizePathSegment(targetDir);

  const fileName = `${timestamp}-${sanitizedFileName}`;
  const saveDir = path.join(
    process.cwd(),
    "public",
    "images",
    safeQualification,
    safeYear,
    safeTargetDir
  );
  const savePath = path.join(saveDir, fileName);

  await fs.mkdir(path.dirname(savePath), { recursive: true });
  await fs.writeFile(savePath, buffer);

  const fileUrl = path
    .join("/", "images", safeQualification, safeYear, safeTargetDir, fileName)
    .replace(/\\/g, "/");

  return NextResponse.json({ url: fileUrl });
}
