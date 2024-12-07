import { createFileSchema } from "@/lib/zod/zodSchema";

const mockFile = (name: string, size: number, type: string): File => {
  // 指定されたサイズの内容を生成
  const content = new Array(size).fill("A").join(""); // 'A' を埋めた文字列
  return new File([content], name, { type });
};

describe("createFileSchema", () => {
  it("should pass validation for a valid file when required", () => {
    const schema = createFileSchema({
      required: true,
      allowedTypes: ["image/jpeg", "image/png"],
      maxSize: 5, // 5 MB
    });

    const file = mockFile("image.jpg", 4 * 1024 * 1024, "image/jpeg"); // 4 MB
    expect(() => schema.parse(file)).not.toThrow();
  });

  it("should fail validation when file is missing and required", () => {
    const schema = createFileSchema({
      required: true,
      allowedTypes: ["image/jpeg", "image/png"],
      maxSize: 5,
    });

    expect(() => schema.parse(undefined)).toThrow("必須です");
  });

  it("should fail validation for a file exceeding max size", () => {
    const schema = createFileSchema({
      required: true,
      allowedTypes: ["image/jpeg", "image/png"],
      maxSize: 5, // 5 MB
    });

    const file = mockFile("image.jpg", 6 * 1024 * 1024, "image/jpeg"); // 6 MB
    expect(() => schema.parse(file)).toThrow("ファイルサイズは最大5MBです");
  });

  it("should fail validation for an invalid file type", () => {
    const schema = createFileSchema({
      required: true,
      allowedTypes: ["image/jpeg", "image/png"],
      maxSize: 5, // 5 MB
    });

    const file = mockFile("document.pdf", 4 * 1024 * 1024, "application/pdf");
    expect(() => schema.parse(file)).toThrow("JPEG, PNG のみ可能です");
  });

  it("should pass validation when file is missing and not required", () => {
    const schema = createFileSchema({
      required: false,
      allowedTypes: ["image/jpeg", "image/png"],
      maxSize: 5,
    });

    expect(() => schema.parse(undefined)).not.toThrow();
  });

  it("should pass validation for an empty file when not required", () => {
    const schema = createFileSchema({
      required: false,
      allowedTypes: ["image/jpeg", "image/png"],
      maxSize: 5,
    });

    const file = mockFile("empty.jpg", 0, "image/jpeg");
    expect(() => schema.parse(file)).not.toThrow();
  });
});
