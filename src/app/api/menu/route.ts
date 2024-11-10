import { NextRequest, NextResponse } from "next/server";
import { getMenuItems } from "@/lib/menu/getMenuItems";
import { createQueryParamsProxy } from "@/lib/proxies/createQueryParamsProxy";
import { MenuItem } from "@/types/quizType";

export type Query = {
  path: string;
};

export async function GET(request: NextRequest) {
  // URLからクエリパラメータを取得
  const searchParams = request.nextUrl.searchParams;
  const { path } = createQueryParamsProxy<Query>(searchParams);

  // パスが取得できなかった場合のエラーハンドリング
  if (!path) {
    return NextResponse.json({ error: "Path is required" }, { status: 400 });
  }

  const menuItems: MenuItem[] = await getMenuItems(path);

  return NextResponse.json(menuItems);
}
