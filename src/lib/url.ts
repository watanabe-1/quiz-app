import { headers } from "next/headers";

const createBaseUrl = (): string => {
  const host = headers().get("host");
  const protocol = process.env.NEXT_PUBLIC_PROTOCOL || "https";

  return `${protocol}://${host}`;
};

export const addBaseUrl = (path: string): string => {
  return `${createBaseUrl()}${path}`;
};
