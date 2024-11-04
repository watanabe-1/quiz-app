import { createHeadersProxy } from "@/lib/headers";
import { addBaseUrl, createQueryParamsProxy, getQueryParam } from "@/lib/url";

const defHeaders = { host: "example.com" };

// createHeadersProxyをモック
jest.mock("@/lib/headers", () => ({
  createHeadersProxy: jest.fn(),
}));

describe("Utility Functions", () => {
  describe("createBaseUrl", () => {
    it("should return base URL with protocol and host", () => {
      (createHeadersProxy as jest.Mock).mockReturnValue(defHeaders);
      process.env.NEXT_PUBLIC_PROTOCOL = "http";

      const expectedUrl = "http://example.com";
      const result = addBaseUrl("");
      expect(result).toBe(expectedUrl);
    });

    it("should use 'https' as default protocol if NEXT_PUBLIC_PROTOCOL is not set", () => {
      (createHeadersProxy as jest.Mock).mockReturnValue(defHeaders);
      delete process.env.NEXT_PUBLIC_PROTOCOL;

      const expectedUrl = "https://example.com";
      const result = addBaseUrl("");
      expect(result).toBe(expectedUrl);
    });

    it("should throw an error if host is not defined", () => {
      (createHeadersProxy as jest.Mock).mockReturnValue({});

      expect(() => addBaseUrl("")).toThrow("Host is not defined");
    });
  });

  describe("addBaseUrl", () => {
    it("should add a path to the base URL", () => {
      (createHeadersProxy as jest.Mock).mockReturnValue(defHeaders);
      process.env.NEXT_PUBLIC_PROTOCOL = "https";

      const path = "/test-path";
      const expectedUrl = "https://example.com/test-path";
      const result = addBaseUrl(path);
      expect(result).toBe(expectedUrl);
    });

    it("should work without a leading slash in the path", () => {
      (createHeadersProxy as jest.Mock).mockReturnValue(defHeaders);
      process.env.NEXT_PUBLIC_PROTOCOL = "https";

      const path = "/test-path";
      const expectedUrl = "https://example.com/test-path";
      const result = addBaseUrl(path);
      expect(result).toBe(expectedUrl);
    });
  });

  describe("getQueryParam", () => {
    it("should return the value of the specified query parameter", () => {
      const searchParams = new URLSearchParams("param=value");
      const result = getQueryParam<{ param: string }>(searchParams, "param");
      expect(result).toBe("value");
    });

    it("should return undefined if the query parameter does not exist", () => {
      const searchParams = new URLSearchParams("param=value");
      const result = getQueryParam<{ param2: string }>(searchParams, "param2");
      expect(result).toBeUndefined();
    });
  });

  describe("createQueryParamsProxy", () => {
    it("should dynamically access query parameters as properties", () => {
      const searchParams = new URLSearchParams("param1=value1&param2=value2");
      const proxy = createQueryParamsProxy<{ param1: string; param2: string }>(
        searchParams,
      );

      expect(proxy.param1).toBe("value1");
      expect(proxy.param2).toBe("value2");
    });

    it("should return undefined for non-existent query parameters", () => {
      const searchParams = new URLSearchParams("param1=value1");
      const proxy = createQueryParamsProxy<{ param1: string; param2: string }>(
        searchParams,
      );

      expect(proxy.param2).toBeUndefined();
    });
  });
});
