import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const targetDir = formData.get("targetDir") as string;

  if (!file || !targetDir) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const timestamp = Date.now();
  const fileName = `${timestamp}-${file.name}`;
  const savePath = path.join(process.cwd(), "public", targetDir, fileName);

  await fs.mkdir(path.dirname(savePath), { recursive: true });
  await fs.writeFile(savePath, buffer);

  const fileUrl = path.join("/", targetDir, fileName).replace(/\\/g, "/");

  return NextResponse.json({ url: fileUrl });
}
