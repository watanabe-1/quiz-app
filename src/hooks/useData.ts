import useSWR, { SWRConfiguration } from "swr";
import { TypedNextResponse } from "@/lib/client/rpc";

export const useData = <T extends object>(
  fetcherFn: () => Promise<TypedNextResponse<T | { error: string }>>,
  url: string,
  config?: SWRConfiguration,
) => {
  const fetcher = async (): Promise<T> => {
    const res = await fetcherFn();
    const json = await res.json();

    if ("error" in json) {
      throw new Error(json.error);
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    return json;
  };

  return useSWR<T>(url, fetcher, {
    revalidateOnFocus: false,
    ...config,
  });
};
