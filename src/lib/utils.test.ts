import { isEmptyObject } from "@/lib/utils";

describe("isEmptyObject", () => {
  test("returns true for an empty object", () => {
    expect(isEmptyObject({})).toBe(true);
  });

  test("returns false for an object with properties", () => {
    expect(isEmptyObject({ key: "value" })).toBe(false);
  });

  test("returns false for non-plain objects", () => {
    class CustomClass {}
    const instance = new CustomClass();
    expect(isEmptyObject(instance)).toBe(false);
  });

  test("returns false for non-object values", () => {
    expect(isEmptyObject([])).toBe(false);
    expect(isEmptyObject("" as unknown as object)).toBe(false);
  });
});
