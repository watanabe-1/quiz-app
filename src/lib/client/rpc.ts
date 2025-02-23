import type { Query as Query_0 } from '../../app/api/admin/exportQuestions/route';
import type { GET as GET_0 } from '../../app/api/admin/exportQuestions/route';
import type { POST as POST_0 } from '../../app/api/admin/uploadImage/route';
import type { Query as Query_1 } from '../../app/api/menu/route';
import type { GET as GET_1 } from '../../app/api/menu/route';
import type { GET as GET_2 } from '../../app/api/questions/[qualification]/[grade]/[year]/[category]/[id]/route';
import type { GET as GET_3 } from '../../app/api/questions/[qualification]/[grade]/[year]/[category]/route';
import type { GET as GET_4 } from '../../app/api/questions/[qualification]/[grade]/[year]/route';
import type { GET as GET_5 } from '../../app/api/questions/[qualification]/[grade]/route';
import type { GET as GET_6 } from '../../app/api/questions/[qualification]/route';
import type { GET as GET_7 } from '../../app/api/questions/route';
import type { NextResponse } from "next/server";




// eslint-disable-next-line @typescript-eslint/no-unused-vars
type InferNextResponseType<T> = T extends (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
) => Promise<NextResponse<infer U>>
  ? U
  : never;

// ランタイムの実態では絶対に使用しないので、 'declare const' で宣言する(あくまで型判定にのみ使用する)
declare const __proxy: unique symbol;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const query: unique symbol;
type Endpoint = { [__proxy]?: true };

type FetcherOptions<TBody = unknown> = {
  body?: TBody;
  next?: NextFetchRequestConfig;
  headers?: HeadersInit;
};

type QueryParams<T = Record<string, string | number>> = T;

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
}

// `$url` を `UsedAsProperty` が `true` の場合は削除する
type PathProxy<
  T,
  UsedAsProperty extends boolean = false,
> = UsedAsProperty extends true
  ? { $match: (path: string) => QueryParams | null }
  : {
      $match: (path: string) => QueryParams | null;
    } & (T extends { query: unknown }
      ? {
          $url: (url: UrlOptions<T["query"], true>) => UrlResult<T["query"]>;
        }
      : { $url: (url?: UrlOptions) => UrlResult }) &
      (T extends { $get: unknown }
        ? T extends { query: unknown }
          ? {
              $get: (
                url: UrlOptions<T["query"], true>,
                option?: FetcherOptions,
              ) => Promise<T["$get"]>;
            }
          : {
              $get: (
                url?: UrlOptions,
                option?: FetcherOptions,
              ) => Promise<T["$get"]>;
            }
        : unknown) &
      (T extends { $post: unknown }
        ? T extends { query: unknown }
          ? {
              $post: (
                url: UrlOptions<T["query"], true>,
                option?: FetcherOptions,
              ) => Promise<T["$post"]>;
            }
          : {
              $post: (
                url?: UrlOptions,
                option?: FetcherOptions,
              ) => Promise<T["$post"]>;
            }
        : unknown);

// `_XX` を関数としても、プロパティとしても扱えるようにする
type ParamFunction<T, UsedAsProperty extends boolean> = ((
  value: string | number,
) => DynamicPathProxy<T, UsedAsProperty>) &
  DynamicPathProxy<T, true>; // `_XX` を一度でもプロパティとして呼んだら `$url` を無効化

type IsPathProxyEnabled<T> = T extends Endpoint ? true : false;

type DynamicPathProxy<T, UsedAsProperty extends boolean = false> = Omit<
  (IsPathProxyEnabled<T> extends true
    ? PathProxy<T, UsedAsProperty>
    : unknown) & {
    [K in keyof T as K extends `$${string}` ? never : K]: K extends `_${string}`
      ? ParamFunction<T[K], UsedAsProperty>
      : DynamicPathProxy<T[K], UsedAsProperty>;
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
  basePath: string,
  params: QueryParams,
  dynamicKeys: string[],
) => {
  const modifiedBasePath = dynamicKeys.length > 0 ? basePath : `${basePath}/`;

  const path = dynamicKeys.reduce(
    (acc, key) =>
      acc.replace(`/_${key}`, `/${encodeURIComponent(params[key])}`),
    modifiedBasePath,
  );

  return (url?: UrlOptions) => ({
    pathname: modifiedBasePath.replace(/\/_(\w+)/g, "/[$1]"),
    query: params,
    hash: url?.hash,
    path: `${path}${buildUrlSuffix(url)}`,
  });
};

export const createRpcClient = <T extends object>(
  basePath: string = "",
  params: QueryParams = {},
  dynamicKeys: string[] = [],
): DynamicPathProxy<T> => {
  const proxy: unknown = new Proxy(
    (_value?: string | number) => {
      if (_value === undefined) {
        return createRpcClient(basePath, params, dynamicKeys);
      }

      const newKey = basePath.split("/").pop() || "";
      if (newKey.startsWith("_")) {
        // 動的パラメータとして扱う
        return createRpcClient(
          basePath,
          { ...params, [newKey.substring(1)]: _value },
          dynamicKeys,
        );
      }

      return createRpcClient(
        `${basePath}/${encodeURIComponent(_value)}`,
        params,
        dynamicKeys,
      );
    },
    {
      get: (target, key: string) => {
        if (key === "$url") {
          return createUrl(basePath, params, dynamicKeys);
        }

        if (key === "$match") {
          return (path: string) => {
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
            const urlObj = createUrl(basePath, params, dynamicKeys)(url);
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

            if (!response.ok)
              throw new Error(`${method} request failed: ${response.status}`);

            return response.json();
          };
        }

        if (key.startsWith("_")) {
          // 動的パラメータとして扱う
          return createRpcClient(`${basePath}/${key}`, params, [
            ...dynamicKeys,
            key.substring(1),
          ]);
        }

        return createRpcClient(`${basePath}/${key}`, params, dynamicKeys);
      },
    },
  );

  return proxy as DynamicPathProxy<T>;
};

export type PathStructure = Endpoint & {
      admin: Endpoint & {
        _qualification: Endpoint & {
          _grade: Endpoint & {
            _year: Endpoint & {
              edit: {
                _id: Endpoint
                }
              }
            }
          },
    export: Endpoint,
    upload: Endpoint & {
          businessCareer: Endpoint
          }
        },
  api: {
        admin: {
          exportQuestions: {query: Query_0} & { $get: InferNextResponseType<typeof GET_0>} & Endpoint,
      uploadImage: { $post: InferNextResponseType<typeof POST_0>} & Endpoint
          },
    auth: {
          _nextauth: Endpoint
          },
    menu: {query: Query_1} & { $get: InferNextResponseType<typeof GET_1>} & Endpoint,
    questions: { $get: InferNextResponseType<typeof GET_7>} & Endpoint & {
          _qualification: { $get: InferNextResponseType<typeof GET_6>} & Endpoint & {
            _grade: { $get: InferNextResponseType<typeof GET_5>} & Endpoint & {
              _year: { $get: InferNextResponseType<typeof GET_4>} & Endpoint & {
                _category: { $get: InferNextResponseType<typeof GET_3>} & Endpoint & {
                  _id: { $get: InferNextResponseType<typeof GET_2>} & Endpoint
                  }
                }
              }
            }
          }
        },
  auth: {
        login: Endpoint
        },
  quiz: {
        _qualification: Endpoint & {
          _grade: Endpoint & {
            _year: Endpoint & {
              _category: Endpoint & {
                _id: Endpoint
                }
              }
            }
          }
        }
      };