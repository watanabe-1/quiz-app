import { NextRequest, NextResponse } from "next/server";
import { createHeadersProxy } from "@/lib/proxies/createHeadersProxy";

// 全リクエストでのヘッダー設定
export function makeResponse() {
  return async (request: NextRequest) => {
    const headersProxy = await createHeadersProxy(request);
    headersProxy["x-pathname"] = request.nextUrl.pathname;
    headersProxy["x-url"] = request.url;

    return NextResponse.next({
      request: {
        headers: headersProxy.headers,
      },
    });
  };
}
