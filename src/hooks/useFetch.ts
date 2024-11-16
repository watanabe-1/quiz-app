import useSWR, { SWRConfiguration } from "swr";

type FetcherOptions<TBody = unknown> = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: TBody;
  headers?: Record<string, string>;
};

/**
 * Fetcher function to handle API requests with optional configurations.
 * @param url - The URL to fetch data from.
 * @param options - Optional configurations like method, headers, and body.
 * @returns The JSON response data.
 * @throws Will throw an error if the request fails.
 */
const fetcher = async <TResponse, TBody = unknown>(
  url: string,
  options?: FetcherOptions<TBody>,
): Promise<TResponse> => {
  const res = await fetch(url, {
    method: options?.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
    credentials: "include",
  });
  // レスポンスが失敗した場合はエラーをスロー
  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.statusText}`);
  }

  return res.json() as Promise<TResponse>;
};

/**
 * Custom hook for data fetching with SWR.
 */
export function useFetch<TResponse, TBody = unknown>(
  url: string,
  options?: FetcherOptions<TBody>,
  config?: SWRConfiguration,
) {
  const { data, error, isLoading, mutate } = useSWR<TResponse>(
    url,
    () => fetcher<TResponse, TBody>(url, options),
    {
      revalidateOnFocus: false,
      ...config,
    },
  );

  return { data, error, isLoading, mutate };
}
