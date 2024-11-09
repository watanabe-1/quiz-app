import { katakanaToNumbersMap } from "@/lib/constants";

/**
 * Extracts the year from the given text using a pattern for Japanese eras (令和, 平成, 昭和).
 * If found, converts full-width characters to half-width.
 *
 * @param text - The input text to extract the year from.
 * @returns The extracted year as a string in half-width format, or `null` if no match is found.
 */
export function extractYear(text: string): string | null {
  const yearPattern = /((令和|平成|昭和)?[0-9０-９]+年度\s?[前後]期)/;
  const yearMatch = text.match(yearPattern);
  return yearMatch ? convertToHalfWidth(yearMatch[0]) : null;
}

/**
 * Extracts the qualification title from the given text.
 * If found, converts full-width characters to half-width.
 *
 * @param text - The input text to extract the title from.
 * @returns The extracted title as a string in half-width format, or `null` if no match is found.
 */
export function extractTitle(text: string): string | null {
  const titlePattern = /([0-9０-９]+級\s?[^\s]+)/;
  const titleMatch = text.match(titlePattern);
  return titleMatch ? convertToHalfWidth(titleMatch[0]) : null;
}

/**
 * Extracts the grade and qualification name from the input string.
 * The input should be in the format: `数字級_資格名`.
 *
 * @param input - The input string to parse.
 * @returns An object containing `grade` and `qualification`, or `null` if the pattern does not match.
 */
export function extractGradeAndQualification(
  input: string,
): { grade: string; qualification: string } | null {
  const match = input.match(/^(\d+級)_(.*)$/);

  if (match) {
    const grade = match[1];
    const qualification = match[2];
    return { grade, qualification };
  }

  return null;
}

/**
 * Converts full-width numbers (０-９) to half-width numbers (0-9).
 *
 * @param str - The input string to convert.
 * @returns A new string with all full-width numbers converted to half-width.
 */
export function convertToHalfWidth(str: string): string {
  return str.replace(/[０-９]/g, (char) =>
    String.fromCharCode(char.charCodeAt(0) - 0xfee0),
  );
}

/**
 * Converts a single Katakana character to a corresponding number based on a predefined map.
 *
 * @param katakana - The Katakana character to convert.
 * @returns The corresponding number, or `null` if the Katakana character is not mapped.
 */
export function convertSingleKatakanaToNumber(katakana: string): number | null {
  return katakanaToNumbersMap.has(katakana)
    ? katakanaToNumbersMap.get(katakana) || null
    : null;
}

/**
 * Replaces all spaces (both half-width and full-width) in the input string with underscores.
 *
 * @param input - The input string to modify.
 * @returns A new string where all spaces are replaced with underscores.
 */
export function replaceSpacesWithUnderscore(input: string): string {
  return input.replace(/[\u0020\u3000]+/g, "_");
}
