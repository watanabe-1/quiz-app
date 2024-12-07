import { z } from "zod";
import { initializeZodErrorMap } from "@/lib/zod/zodErrorMap";

describe("initializeZodErrorMap", () => {
  beforeAll(() => {
    // Initialize the custom error map
    initializeZodErrorMap();
  });

  it("should use the custom error map for invalid type errors", () => {
    const schema = z.string();
    const result = schema.safeParse(123);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe(
        "期待される値: string、受け取った値: number",
      );
    }
  });

  it("should use the custom error map for missing required values", () => {
    const schema = z.string();
    const result = schema.safeParse(undefined);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe("必須項目です");
    }
  });

  it("should use the custom error map for invalid enum values", () => {
    const schema = z.enum(["A", "B", "C"]);
    const result = schema.safeParse("D");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe(
        "無効な列挙型の値です。期待される値: 'A' | 'B' | 'C'、受け取った値: 'D'",
      );
    }
  });

  it("should fallback to the default error message for unsupported error codes", () => {
    const schema = z.date();
    const result = schema.safeParse("invalid-date");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe(
        "期待される値: date、受け取った値: string",
      );
    }
  });
});
