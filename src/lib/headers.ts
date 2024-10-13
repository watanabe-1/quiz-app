import { headers } from "next/headers";
import { HEADERS_URL, HEADERS_PATHNAME } from "./constants";

export const getUrl = async () => {
  return decodeURIComponent((await headers().get(HEADERS_URL)) || "");
};

export const getPath = async () => {
  return decodeURIComponent((await headers().get(HEADERS_PATHNAME)) || "");
};
