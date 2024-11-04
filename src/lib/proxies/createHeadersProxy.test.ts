import * as nextHeaders from "next/headers";
import { CustomizableRequestHeaders } from "@/@types/quizType";
import { createHeadersProxy } from "@/lib/proxies/createHeadersProxy";

// モジュール全体をモック化
jest.mock("next/headers", () => ({
  headers: jest.fn(),
}));

describe("createHeadersProxy", () => {
  let headersProxy: CustomizableRequestHeaders;

  beforeEach(() => {
    headersProxy = createHeadersProxy();
  });

  it("should retrieve an existing header", () => {
    // モックの headers 関数が 'user-agent' ヘッダーを返すように設定
    (nextHeaders.headers as jest.Mock).mockImplementation(
      () => new Map([["user-agent", "TestAgent"]]),
    );

    const userAgent = headersProxy["user-agent"];
    expect(userAgent).toBe("TestAgent");
  });

  it("should return undefined for a non-existent header", () => {
    // モックの headers 関数が空の Map を返すように設定
    (nextHeaders.headers as jest.Mock).mockImplementation(() => new Map());

    // 存在しないヘッダーを確認
    const nonExistentHeader =
      headersProxy["non-existent" as keyof CustomizableRequestHeaders];
    expect(nonExistentHeader).toBeUndefined();
  });

  it("should set and retrieve a custom header", () => {
    headersProxy["x-url"] = "https://example.com";
    expect(headersProxy["x-url"]).toBe("https://example.com");
  });

  it("should override an existing standard header", () => {
    headersProxy["content-type"] = "application/json";
    expect(headersProxy["content-type"]).toBe("application/json");
  });

  it("should return the updated value after setting a new value for an existing header", () => {
    headersProxy["authorization"] = "Bearer old-token";
    expect(headersProxy["authorization"]).toBe("Bearer old-token");

    headersProxy["authorization"] = "Bearer new-token";
    expect(headersProxy["authorization"]).toBe("Bearer new-token");
  });
});
