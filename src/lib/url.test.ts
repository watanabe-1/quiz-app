import { path_quiz_qualification_grade_year_category_id } from "@/lib/path";
import { createHeadersProxy } from "@/lib/proxies/createHeadersProxy";
import { addBaseUrl, generatePatternFromPath, getQueryParam } from "@/lib/url";

const defHeaders = { host: "example.com" };

// createHeadersProxyをモック
jest.mock("@/lib/proxies/createHeadersProxy", () => ({
  createHeadersProxy: jest.fn(),
}));

describe("Utility Functions", () => {
  describe("createBaseUrl", () => {
    it("should return base URL with protocol and host", async () => {
      (createHeadersProxy as jest.Mock).mockResolvedValue(
        Promise.resolve(defHeaders),
      );
      process.env.NEXT_PUBLIC_PROTOCOL = "http";

      const expectedUrl = "http://example.com";
      const result = await addBaseUrl("");
      expect(result).toBe(expectedUrl);
    });

    it("should use 'https' as default protocol if NEXT_PUBLIC_PROTOCOL is not set", async () => {
      (createHeadersProxy as jest.Mock).mockResolvedValue(
        Promise.resolve(defHeaders),
      );
      delete process.env.NEXT_PUBLIC_PROTOCOL;

      const expectedUrl = "https://example.com";
      const result = await addBaseUrl("");
      expect(result).toBe(expectedUrl);
    });

    it("should throw an error if host is not defined", async () => {
      (createHeadersProxy as jest.Mock).mockResolvedValue({});

      await expect(addBaseUrl("")).rejects.toThrow("Host is not defined");
    });
  });

  describe("addBaseUrl", () => {
    it("should add a path to the base URL", async () => {
      (createHeadersProxy as jest.Mock).mockResolvedValue(
        Promise.resolve(defHeaders),
      );
      process.env.NEXT_PUBLIC_PROTOCOL = "https";

      const path = "/test-path";
      const expectedUrl = "https://example.com/test-path";
      const result = await addBaseUrl(path);
      expect(result).toBe(expectedUrl);
    });

    it("should work without a leading slash in the path", async () => {
      (createHeadersProxy as jest.Mock).mockResolvedValue(
        Promise.resolve(defHeaders),
      );
      process.env.NEXT_PUBLIC_PROTOCOL = "https";

      const path = "/test-path";
      const expectedUrl = "https://example.com/test-path";
      const result = await addBaseUrl(path);
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

  describe("Utility Functions", () => {
    describe("generatePatternFromPath", () => {
      it("should generate the correct regex pattern for the quiz URL", () => {
        // Generate the regex pattern using the path function without specifying paramCount
        const pattern = generatePatternFromPath(
          path_quiz_qualification_grade_year_category_id,
        );

        // Expected regex pattern
        const expectedPattern =
          /^\/quiz\/([^/]+)\/([^/]+)\/([^/]+)\/([^/]+)\/([^/]+)$/;
        expect(pattern.toString()).toBe(expectedPattern.toString());

        // Test if the generated pattern matches a sample URL
        const testUrl = "/quiz/qualification1/grade2/2024/category3/123";
        const match = testUrl.match(pattern);

        // Validate that the match was successful and parameters are correctly extracted
        expect(match).not.toBeNull();
        if (match) {
          const [_, qualification, grade, year, category, id] = match;
          expect(qualification).toBe("qualification1");
          expect(grade).toBe("grade2");
          expect(year).toBe("2024");
          expect(category).toBe("category3");
          expect(id).toBe("123");
        }
      });

      it("should not match an incorrect URL pattern", () => {
        const pattern = generatePatternFromPath(
          path_quiz_qualification_grade_year_category_id,
        );
        const testUrl = "/invalid/url/structure";
        const match = testUrl.match(pattern);
        expect(match).toBeNull();
      });
    });
  });
});
