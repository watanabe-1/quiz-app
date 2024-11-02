"use server";

import { headers } from "next/headers";
import { HEADERS_URL, HEADERS_PATHNAME } from "@/lib/constants";

const HEADERS_HOST = "host";

const headersGet = (name: string) =>
  decodeURIComponent(headers().get(name) || "");

export const getUrl = async () => headersGet(HEADERS_URL);

export const getPath = async () => headersGet(HEADERS_PATHNAME);

export const getHost = async () => headersGet(HEADERS_HOST);
