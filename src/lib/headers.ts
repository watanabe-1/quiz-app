"use server";

import { headers } from "next/headers";
import { HEADERS_URL, HEADERS_PATHNAME } from "@/lib/constants";

const HEADERS_HOST = "host";

const headersGet = (name: string) =>
  decodeURIComponent(headers().get(name) || "");

export const getUrl = () => headersGet(HEADERS_URL);

export const getPath = () => headersGet(HEADERS_PATHNAME);

export const getHost = () => headersGet(HEADERS_HOST);
