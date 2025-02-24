import type { NextResponse } from "next/server";

type InferNextResponseType<T> = T extends (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
) => Promise<NextResponse<infer U>>
  ? U
  : never;

export interface TypedNextResponse<T> extends NextResponse {
  json: () => Promise<T>;
}

// ランタイムの実態では絶対に使用しないので、 'declare const' で宣言する(あくまで型判定にのみ使用する)
declare const __proxy: unique symbol;
type Endpoint = { [__proxy]?: true };

type FetcherOptions<TBody = unknown> = {
  body?: TBody;
  next?: NextFetchRequestConfig;
  headers?: HeadersInit;
};

type QueryParams<T = Record<string, string | number>> = T;
type MatchResult<T = Record<string, string>> = T;

type UrlOptions<
  TQuery = QueryParams,
  TIsRequired = false,
> = TIsRequired extends true
  ? { query: TQuery; hash?: string }
  : { query?: TQuery; hash?: string };

interface UrlResult<TQuery = QueryParams> {
  pathname: string;
  query: TQuery;
  hash?: string;
  path: string;
  relativePath: string;
}

type InferResponse<T> = TypedNextResponse<InferNextResponseType<T>>;

// queryが指定されたときはUrlOptionsからqueryを必ず指定する
type UrlArg<T> = T extends { query: unknown }
  ? [url: UrlOptions<T["query"], true>]
  : [url?: UrlOptions];

// `_XX` を一度でもプロパティとして呼んだ時の型
type PathProxyAsProperty = { $match: (path: string) => MatchResult | null };

// `_XX` を一度もプロパティとして呼んでない時の型
type PathProxyAsFunction<T> = {
  $url: (
    ...args: UrlArg<T>
  ) => UrlResult<T extends { query: unknown } ? T["query"] : QueryParams>;
} & (T extends { $get: unknown }
  ? {
      $get: (
        ...args: [...UrlArg<T>, option?: FetcherOptions]
      ) => Promise<InferResponse<T["$get"]>>;
    }
  : unknown) &
  (T extends { $post: unknown }
    ? {
        $post: (
          ...args: [...UrlArg<T>, option?: FetcherOptions]
        ) => Promise<InferResponse<T["$post"]>>;
      }
    : unknown);

type PathProxy<
  T,
  TUsedAsProperty extends boolean = false,
> = TUsedAsProperty extends true ? PathProxyAsProperty : PathProxyAsFunction<T>;

// `_XX` を関数としても、プロパティとしても扱えるようにする
type ParamFunction<T, TUsedAsProperty extends boolean> = ((
  value: string | number,
) => DynamicPathProxy<T, TUsedAsProperty>) &
  DynamicPathProxy<T, true>; // `_XX` を一度でもプロパティとして呼んだら `$url` を無効化

type IsPathProxyEnabled<T> = T extends Endpoint ? true : false;

type DynamicPathProxy<T, TUsedAsProperty extends boolean = false> = Omit<
  (IsPathProxyEnabled<T> extends true
    ? PathProxy<T, TUsedAsProperty>
    : unknown) & {
    [K in keyof T as K extends `$${string}` ? never : K]: K extends `_${string}`
      ? ParamFunction<T[K], TUsedAsProperty>
      : DynamicPathProxy<T[K], TUsedAsProperty>;
  },
  "query"
>;

function buildUrlSuffix(url?: UrlOptions): string {
  if (!url) return "";
  const query = url.query
    ? "?" + new URLSearchParams(url.query as Record<string, string>).toString()
    : "";
  const hash = url.hash ? `#${url.hash}` : "";

  return query + hash;
}

const createUrl = (
  paths: string[],
  params: QueryParams,
  dynamicKeys: string[],
) => {
  const baseUrl = paths.shift();
  const basePath = paths.join("/");

  const dynamicPath = dynamicKeys.reduce(
    (acc, key) =>
      acc.replace(`/_${key}`, `/${encodeURIComponent(params[key])}`),
    basePath,
  );

  return (url?: UrlOptions) => ({
    pathname: basePath.replace(/\/_(\w+)/g, "/[$1]"),
    query: params,
    hash: url?.hash,
    path: `${baseUrl}/${dynamicPath}${buildUrlSuffix(url)}`,
    relativePath: `/${dynamicPath}${buildUrlSuffix(url)}`,
  });
};

const createRpcProxy = <T extends object>(
  paths: string[] = [],
  params: QueryParams = {},
  dynamicKeys: string[] = [],
): DynamicPathProxy<T> => {
  const proxy: unknown = new Proxy(
    (value?: string | number) => {
      if (value === undefined) {
        return createRpcProxy([...paths], params, dynamicKeys);
      }

      const newKey = paths.at(-1) || "";
      if (newKey.startsWith("_")) {
        // 動的パラメータとして扱う
        return createRpcProxy(
          [...paths],
          { ...params, [newKey.substring(1)]: value },
          dynamicKeys,
        );
      }

      return createRpcProxy([...paths], params, dynamicKeys);
    },
    {
      get: (_, key: string) => {
        if (key === "$url") {
          return createUrl([...paths], params, dynamicKeys);
        }

        if (key === "$match") {
          return (path: string) => {
            const basePath = `/${paths.slice(1).join("/")}`;
            const regexPattern = basePath.replace(/_[^/]+/g, "([^/]+)");
            const match = new RegExp(`^${regexPattern}$`).exec(path);
            if (!match) return null;

            return dynamicKeys.reduce(
              (acc, key, index) => ({ ...acc, [key]: match[index + 1] }),
              {},
            );
          };
        }

        if (key === "$get" || key === "$post") {
          return async (url?: UrlOptions, options?: FetcherOptions) => {
            const urlObj = createUrl([...paths], params, dynamicKeys)(url);
            const method = key.replace(/^\$/, "").toUpperCase();

            const response = await fetch(urlObj.path, {
              method: method,
              next: options?.next,
              headers: {
                "Content-Type": "application/json",
                ...options?.headers,
              },
              body: options?.body ? JSON.stringify(options.body) : undefined,
              credentials: "include",
            });

            return response;
          };
        }

        if (key.startsWith("_")) {
          // 動的パラメータとして扱う
          return createRpcProxy([...paths, key], params, [
            ...dynamicKeys,
            key.substring(1),
          ]);
        }

        return createRpcProxy([...paths, key], params, dynamicKeys);
      },
    },
  );

  return proxy as DynamicPathProxy<T>;
};

export const createRpcClient = <T extends object>(baseUrl: string) =>
  createRpcProxy<T>([baseUrl]);
