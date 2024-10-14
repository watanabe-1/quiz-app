import { headers } from "next/headers";

const createBaseUrl = (): string => {
  const host = headers().get("host");
  const protocol = process.env.NEXT_PUBLIC_PROTOCOL || "https";

  return `${protocol}://${host}`;
};

export const addBaseUrl = (path: string): string => {
  return `${createBaseUrl()}${path}`;
};

export const getQueryParam = <T extends Record<string, string>>(
  searchParams: URLSearchParams,
  key: keyof T,
): string | undefined => {
  const value = searchParams.get(key as string); // key を string 型にキャスト
  return value ?? undefined;
};
