import { katakanaToNumbersMap } from "./constants";

export function extractYear(text: string) {
  const yearPattern = /((令和|平成|昭和)?[0-9０-９]+年度\s?[前後]期)/;
  const yearMatch = text.match(yearPattern);
  return yearMatch ? convertToHalfWidth(yearMatch[0]) : null;
}

export function extractTitle(text: string) {
  const titlePattern = /([0-9０-９]+級\s?[^\s]+)/;
  const titleMatch = text.match(titlePattern);
  return titleMatch ? convertToHalfWidth(titleMatch[0]) : null;
}

// 級と試験名を抽出する関数
export function extractGradeAndQualification(
  input: string,
): { grade: string; qualification: string } | null {
  // 正規表現: 数字＋級_で始まるものと、それ以降の資格名を分離
  const match = input.match(/^(\d+級)_(.*)$/);

  if (match) {
    const grade = match[1]; // 例えば "3級"
    const qualification = match[2]; // 例えば "テスト試験"
    return { grade, qualification };
  }

  // パターンにマッチしなかった場合は null を返す
  return null;
}

export function convertToHalfWidth(str: string) {
  return str.replace(/[０-９]/g, function (char) {
    return String.fromCharCode(char.charCodeAt(0) - 0xfee0);
  });
}

export function convertSingleKatakanaToNumber(katakana: string): number | null {
  // カタカナがマップに存在するか確認
  return katakanaToNumbersMap.has(katakana)
    ? katakanaToNumbersMap.get(katakana) || null
    : null;
}

export function replaceSpacesWithUnderscore(input: string): string {
  // 半角スペース（\u0020）と全角スペース（\u3000）を1個以上連続する部分にマッチさせる正規表現
  return input.replace(/[\u0020\u3000]+/g, "_");
}
