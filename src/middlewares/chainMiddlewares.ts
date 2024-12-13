import { NextMiddleware } from "next/server";
import { makeResponse } from "@/middlewares/makeResponse";

/**
 * Represents a factory function for creating a middleware.
 *
 * @typeParam middleware - The next middleware in the chain to be executed.
 * @returns A `NextMiddleware` function that takes a `Request` and returns a `Response`.
 *
 * @remarks
 * - The factory function takes the next middleware in the chain as an argument and returns a new middleware function.
 * - This allows middleware to be composed and chained together, where each middleware can perform actions before or after calling the next middleware.
 *
 * @example
 * ```typescript
 * const loggingMiddleware: MiddlewareFactory = (next) => (req) => {
 *   console.log("Request received");
 *   return next(req);
 * };
 *
 * const responseMiddleware: MiddlewareFactory = (next) => (req) => {
 *   const res = next(req);
 *   res.headers.set("X-Custom-Header", "MyValue");
 *   return res;
 * };
 * ```
 */
export type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware;

/**
 * Chains multiple middleware functions together.
 *
 * @param functions - An array of middleware factories to be executed sequentially.
 * @param index - The current index of the middleware being processed. Defaults to 0.
 * @returns A `NextMiddleware` function that processes the middleware chain or returns the default response if no more middleware is left.
 *
 * @example
 * ```typescript
 * const middleware1: MiddlewareFactory = (next) => (req) => {
 *   console.log("Middleware 1");
 *   return next(req);
 * };
 *
 * const middleware2: MiddlewareFactory = (next) => (req) => {
 *   console.log("Middleware 2");
 *   return next(req);
 * };
 *
 * const chainedMiddleware = chainMiddlewares([middleware1, middleware2]);
 * ```
 */
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
