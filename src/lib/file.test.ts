import { sizeInMB } from "@/lib/file";

describe("sizeInMB", () => {
  it("should convert bytes to megabytes with the default number of decimals (2)", () => {
    const sizeInBytes = 1048576; // 1 MB in bytes
    const result = sizeInMB(sizeInBytes);
    expect(result).toBe(1.0); // 1 MB
  });

  it("should convert bytes to megabytes with a specified number of decimals", () => {
    const sizeInBytes = 1572864; // 1.5 MB in bytes
    const result = sizeInMB(sizeInBytes, 1);
    expect(result).toBe(1.5); // 1.5 MB with 1 decimal
  });

  it("should round the result to the nearest specified decimal", () => {
    const sizeInBytes = 1600000; // Approx 1.52587890625 MB
    const result = sizeInMB(sizeInBytes, 2);
    expect(result).toBe(1.53); // Rounded to 2 decimals
  });

  it("should handle zero bytes correctly", () => {
    const sizeInBytes = 0;
    const result = sizeInMB(sizeInBytes);
    expect(result).toBe(0.0); // 0 MB
  });

  it("should handle very large byte values correctly", () => {
    const sizeInBytes = 1073741824; // 1 GB in bytes
    const result = sizeInMB(sizeInBytes);
    expect(result).toBe(1024.0); // 1024 MB
  });
});
