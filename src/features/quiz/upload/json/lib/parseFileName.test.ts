import { parseFileName } from "@/features/quiz/upload/json/lib/parseFileName";

describe("parseFileName", () => {
  test("Should correctly parse a filename with full format including additional year details", () => {
    const file = new File([], "qualification_grade_2024_exam1.pdf");
    const result = parseFileName(file);

    expect(result).toEqual({
      qualification: "qualification",
      grade: "grade",
      year: "2024_exam1",
    });
  });

  test("Should correctly parse a filename with minimal required parts", () => {
    const file = new File([], "qualification_grade_2024.pdf");
    const result = parseFileName(file);

    expect(result).toEqual({
      qualification: "qualification",
      grade: "grade",
      year: "2024",
    });
  });

  test("Should return null when the filename is missing necessary parts", () => {
    const file = new File([], "qualification_grade.pdf");
    const result = parseFileName(file);

    expect(result).toBeNull();
  });

  test("Should return null when the filename has insufficient underscores", () => {
    const file = new File([], "qualification.pdf");
    const result = parseFileName(file);

    expect(result).toBeNull();
  });

  test("Should parse correctly when the filename has no extension", () => {
    const file = new File([], "qualification_grade_2024");
    const result = parseFileName(file);

    expect(result).toEqual({
      qualification: "qualification",
      grade: "grade",
      year: "2024",
    });
  });

  test("Should return null when the filename is empty except for the extension", () => {
    const file = new File([], ".pdf");
    const result = parseFileName(file);

    expect(result).toBeNull();
  });
});
