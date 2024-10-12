import { NextMiddleware } from "next/server";
import { makeResponse } from "./makeResponse";

export type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware;

// ミドルウェアを連結する関数
export function chainMiddlewares(
  functions: MiddlewareFactory[] = [],
  index = 0,
): NextMiddleware {
  const current = functions[index];
  if (current) {
    const next = chainMiddlewares(functions, index + 1);
    return current(next);
  }

  return makeResponse();
}
