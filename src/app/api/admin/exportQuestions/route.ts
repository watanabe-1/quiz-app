import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import {
  fetchGetQuestionsByCategory,
  fetchGetYearsByQualificationAndGrade,
} from "@/lib/api";
import { ALL_CATEGORY } from "@/lib/constants";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const qualification = searchParams.get("qualification");
    const grade = searchParams.get("grade");
    const year = searchParams.get("year");

    if (!qualification || !grade) {
      return NextResponse.json(
        { error: "Qualification and grade parameters are required" },
        { status: 400 }
      );
    }

    const zip = new JSZip();

    if (year) {
      // 資格、級、年度が指定された場合、その組み合わせのデータを取得
      const questionsData = await fetchGetQuestionsByCategory(
        qualification,
        grade,
        year,
        ALL_CATEGORY
      );

      if (questionsData.length > 0) {
        const fileName = `${qualification}_${grade}_${year}.json`;
        zip.file(fileName, JSON.stringify(questionsData, null, 2));
      }
    } else {
      // 資格と級が指定された場合、すべての年度を対象にデータを取得
      const years = await fetchGetYearsByQualificationAndGrade(
        qualification,
        grade
      );

      for (const yr of years) {
        const questionsData = await fetchGetQuestionsByCategory(
          qualification,
          grade,
          yr,
          ALL_CATEGORY
        );

        if (questionsData.length > 0) {
          const fileName = `${qualification}_${grade}_${yr}.json`;
          zip.file(fileName, JSON.stringify(questionsData, null, 2));
        }
      }
    }

    if (Object.keys(zip.files).length === 0) {
      return NextResponse.json({ error: "No data found" }, { status: 404 });
    }

    const content = await zip.generateAsync({ type: "nodebuffer" });

    const headers = new Headers();
    headers.append("Content-Type", "application/zip");
    const fileName = year
      ? `${qualification}_${grade}_${year}.zip`
      : `${qualification}_${grade}.zip`;
    headers.append(
      "Content-Disposition",
      `attachment; filename=${encodeURIComponent(fileName)}`
    );

    return new NextResponse(content, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error exporting questions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
