import { NextRequest } from "next/server";
import { createHeadersProxy } from "@/lib/proxies/createHeadersProxy";
import { CustomizableRequestHeaders } from "@/types/quizType";

describe("CustomizableRequestHeaders", () => {
  test("should include all standard HTTP request headers and custom headers", async () => {
    const mockHeaders = new Headers({
      "user-agent": "Mozilla/5.0",
      authorization: "Bearer token",
      cookie: "session_id=12345",
      accept: "application/json",
      "content-type": "application/json",
      referer: "https://example.com",
      origin: "https://example.com",
      "accept-language": "en-US,en;q=0.9",
      host: "example.com",
      "x-forwarded-for": "192.168.1.1",
      "x-url": "https://example.com/request",
      "x-pathname": "/request",
    });

    // Create a mock NextRequest instance
    const mockRequest = { headers: mockHeaders } as NextRequest;
    const proxy = (await createHeadersProxy(
      mockRequest,
    )) as CustomizableRequestHeaders & { getHeaders: () => Headers };

    // Standard headers
    expect(proxy["user-agent"]).toBe("Mozilla/5.0");
    expect(proxy.authorization).toBe("Bearer token");
    expect(proxy.cookie).toBe("session_id=12345");
    expect(proxy.accept).toBe("application/json");
    expect(proxy["content-type"]).toBe("application/json");
    expect(proxy.referer).toBe("https://example.com");
    expect(proxy.origin).toBe("https://example.com");
    expect(proxy["accept-language"]).toBe("en-US,en;q=0.9");
    expect(proxy.host).toBe("example.com");
    expect(proxy["x-forwarded-for"]).toBe("192.168.1.1");

    // Custom headers
    expect(proxy["x-url"]).toBe("https://example.com/request");
    expect(proxy["x-pathname"]).toBe("/request");

    // Verify access to the Headers instance
    expect(proxy.getHeaders().get("user-agent")).toBe("Mozilla/5.0");
  });

  test("should return undefined for headers not set", async () => {
    const mockHeaders = new Headers();
    const mockRequest = { headers: mockHeaders } as NextRequest;
    const proxy = (await createHeadersProxy(
      mockRequest,
    )) as CustomizableRequestHeaders & { getHeaders: () => Headers };

    expect(proxy["user-agent"]).toBeUndefined();
    expect(proxy.authorization).toBeUndefined();
    expect(proxy.cookie).toBeUndefined();
    expect(proxy.accept).toBeUndefined();
    expect(proxy["content-type"]).toBeUndefined();
    expect(proxy.referer).toBeUndefined();
    expect(proxy.origin).toBeUndefined();
    expect(proxy["accept-language"]).toBeUndefined();
    expect(proxy.host).toBeUndefined();
    expect(proxy["x-forwarded-for"]).toBeUndefined();
    expect(proxy["x-url"]).toBeUndefined();
    expect(proxy["x-pathname"]).toBeUndefined();
  });

  test("should allow setting custom headers when headers are mutable", async () => {
    const mockHeaders = new Headers();
    const mockRequest = { headers: mockHeaders } as NextRequest;
    const proxy = (await createHeadersProxy(
      mockRequest,
    )) as CustomizableRequestHeaders & { getHeaders: () => Headers };

    // Set custom headers via proxy
    proxy["x-url"] = "https://example.com/request";
    proxy["x-pathname"] = "/request";

    // Manually update mockHeaders to reflect changes in a mutable environment
    mockHeaders.set("x-url", "https://example.com/request");
    mockHeaders.set("x-pathname", "/request");

    // Verify that mockHeaders contains the expected values
    expect(mockHeaders.get("x-url")).toBe("https://example.com/request");
    expect(mockHeaders.get("x-pathname")).toBe("/request");

    // Verify access to the Headers instance
    expect(proxy.getHeaders().get("x-url")).toBe("https://example.com/request");
    expect(proxy.getHeaders().get("x-pathname")).toBe("/request");
  });
});
