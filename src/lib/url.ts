import { getHost } from "@/lib/headers";

const createBaseUrl = async (): Promise<string> => {
  const host = await getHost();
  const protocol = process.env.NEXT_PUBLIC_PROTOCOL || "https";

  return `${protocol}://${host}`;
};

export const addBaseUrl = async (path: string): Promise<string> => {
  return `${await createBaseUrl()}${path}`;
};

export const getQueryParam = <T extends Record<string, string>>(
  searchParams: URLSearchParams,
  key: keyof T,
): string | undefined => {
  const value = searchParams.get(key as string); // key を string 型にキャスト
  return value ?? undefined;
};
