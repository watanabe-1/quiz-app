import { getHost } from "@/lib/headers";
import { addBaseUrl, createQueryParamsProxy, getQueryParam } from "@/lib/url";

// getHostをモック
jest.mock("@/lib/headers", () => ({
  getHost: jest.fn(),
}));

describe("Utility Functions", () => {
  describe("createBaseUrl", () => {
    it("should return base URL with protocol and host", () => {
      (getHost as jest.Mock).mockReturnValue("example.com");
      process.env.NEXT_PUBLIC_PROTOCOL = "http";

      const expectedUrl = "http://example.com";
      const result = addBaseUrl("");
      expect(result).toBe(expectedUrl);
    });

    it("should use 'https' as default protocol if NEXT_PUBLIC_PROTOCOL is not set", () => {
      (getHost as jest.Mock).mockReturnValue("example.com");
      delete process.env.NEXT_PUBLIC_PROTOCOL;

      const expectedUrl = "https://example.com";
      const result = addBaseUrl("");
      expect(result).toBe(expectedUrl);
    });

    it("should throw an error if host is not defined", () => {
      (getHost as jest.Mock).mockReturnValue(null);

      expect(() => addBaseUrl("")).toThrow("Host is not defined");
    });
  });

  describe("addBaseUrl", () => {
    it("should add a path to the base URL", () => {
      (getHost as jest.Mock).mockReturnValue("example.com");
      process.env.NEXT_PUBLIC_PROTOCOL = "https";

      const path = "/test-path";
      const expectedUrl = "https://example.com/test-path";
      const result = addBaseUrl(path);
      expect(result).toBe(expectedUrl);
    });

    it("should work without a leading slash in the path", () => {
      (getHost as jest.Mock).mockReturnValue("example.com");
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
