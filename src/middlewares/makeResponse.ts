import { NextRequest, NextResponse } from "next/server";
import { HEADERS_URL, HEADERS_PATHNAME } from "@/lib/constants";

// 全リクエストでのヘッダー設定
export function makeResponse() {
  return async (request: NextRequest) => {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(HEADERS_URL, request.url);
    requestHeaders.set(HEADERS_PATHNAME, request.nextUrl.pathname);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  };
}
