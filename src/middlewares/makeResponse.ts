import { NextRequest, NextResponse } from "next/server";
import { createHeadersProxy } from "@/lib/headers";

// 全リクエストでのヘッダー設定
export function makeResponse() {
  return async (request: NextRequest) => {
    const requestHeaders = new Headers(request.headers);
    const headersProxy = createHeadersProxy();
    headersProxy["x-pathname"] = request.nextUrl.pathname;
    headersProxy["x-url"] = request.url;

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  };
}
