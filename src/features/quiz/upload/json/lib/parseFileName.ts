export const parseFileName = (file: File) => {
  const fileName = file.name.split(".")[0]; // 拡張子を除く
  const nameWithoutExtension = fileName.split(".")[0]; // 拡張子を除く
  const parts = nameWithoutExtension.split("_");

  if (parts.length >= 3) {
    return {
      qualification: parts[0],
      grade: parts[1],
      year: parts.slice(2).join("_"), // parts[2]以降を結合してyearとする
    };
  }

  return null; // 必要な部分が不足している場合
};
