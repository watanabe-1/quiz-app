import { headers } from "next/headers";
import { createPath } from "@/lib/path";

const createBaseUrl = (): string => {
  const host = headers().get("host");
  const protocol = process.env.NEXT_PUBLIC_PROTOCOL || "https";

  return `${protocol}://${host}`;
};

export const createApiUrl = (
  basePath: string,
  ...segments: (string | number)[]
): string => {
  return `${createBaseUrl()}${createPath(basePath, ...segments)}`;
};
