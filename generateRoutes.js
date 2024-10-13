// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

// コマンドライン引数を取得
const [baseDir, outputPath, methodOption, printPathnameArg] =
  process.argv.slice(2);

// printPathnameフラグをbooleanに変換
const printPathname = printPathnameArg === "true";

if (!baseDir || !outputPath || !methodOption) {
  console.error(
    "Usage: node generatePagesPath.js <baseDir> <outputPath> <methodOption(all|one|both)> <printPathname(true|false)>",
  );
  process.exit(1);
}

// オプションのバリデーション
if (!["all", "one", "both"].includes(methodOption)) {
  console.error("Invalid method option. Use 'all', 'one', or 'both'.");
  process.exit(1);
}

// 特殊なファイル名を定義
const pageFileNames = ["page.tsx", "page.jsx", "route.ts", "route.js"];

// generateSuffix関数の定義
const generateSuffixFunction = `
const generateSuffix = (url?: { query?: Record<string, string>, hash?: string }) => {
  if (!url) return "";
  const query = url?.query;
  const hash = url?.hash;
  if (!query && !hash) return '';
  const search = query ? \`?\${new URLSearchParams(query)}\` : '';
  return \`\${search}\${hash ? \`#\${hash}\` : ''}\`;
};`;

// 変数名の無効な文字を削除
const sanitizeVariableName = (name) => {
  return name.replace(/\//g, "_").replace(/\[|\]/g, "").replace("...", "___");
};

// createMethods関数の定義
const createMethodsAll = (indent, slugs, pathname, isCatchAll) => {
  const queryParam = "url?: { query?: Record<string, string>, hash?: string }";
  const slugParam = slugs.length ? `query: { ${slugs.join(", ")} },` : "";
  const pathExpression = isCatchAll
    ? `\`${pathname.replace(/\[\[?\.\.\.(.*?)\]\]?/g, (_, p1) => `\${${p1}?.join('/') ?? ''}`)}\${generateSuffix(url)}\``
    : `\`${pathname.replace(/\[([^\]]+)\]/g, (_, p1) => `\${${p1}}`)}\${generateSuffix(url)}\``;

  return `${indent}$url: (${queryParam}) => ({${
    printPathname ? ` pathname: '${pathname}' as const,` : ""
  }${slugParam ? ` ${slugParam}` : ""} hash: url?.hash, path: ${pathExpression} })`;
};

const createMethodsOne = (slugs, pathname, isCatchAll) => {
  const paramList = slugs.map(
    (slug) => `${slug}: string${isCatchAll ? "[]" : ""}`,
  );
  const queryParam = "url?: { query?: Record<string, string>, hash?: string }";
  const slugParam = slugs.length ? `query: { ${slugs.join(", ")} },` : "";
  const pathExpression = isCatchAll
    ? `\`${pathname.replace(/\[\[?\.\.\.(.*?)\]\]?/g, (_, p1) => `\${${p1}?.join('/') ?? ''}`)}\${generateSuffix(url)}\``
    : `\`${pathname.replace(/\[([^\]]+)\]/g, (_, p1) => `\${${p1}}`)}\${generateSuffix(url)}\``;

  return `(${paramList}) => {
          return {
            $url: (${queryParam}) => ({${
              printPathname ? ` pathname: '${pathname}' as const,` : ""
            }${slugParam ? ` ${slugParam}` : ""} hash: url?.hash, path: ${pathExpression} })
          }
        }`;
};

// ディレクトリを再帰的に走査して各パスごとの変数を構築
const parseAppDir = (
  input,
  indent = "",
  slugs = [],
  url = "",
  parentCatchAll = false,
  parentOptionalCatchAll = false,
  exportPaths = {},
) => {
  indent += "  ";
  const props = [];
  const entries = fs.readdirSync(input, { withFileTypes: true });

  entries
    .filter(
      (entry) =>
        !entry.name.startsWith("_") &&
        !entry.name.startsWith(".") &&
        !["node_modules"].includes(entry.name),
    )
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((entry) => {
      const fullPath = path.join(input, entry.name);
      const nameWithoutExt = entry.isFile()
        ? entry.name.replace(/\.[^/.]+$/, "") // 拡張子を除去
        : entry.name;

      // 特殊なファイル以外を無視
      if (entry.isFile() && !pageFileNames.includes(entry.name)) {
        return;
      }

      const newSlugs = [...slugs];

      let isCatchAll = parentCatchAll; // 親から継承する
      let isOptionalCatchAll = parentOptionalCatchAll; // 親から継承する
      if (entry.isDirectory()) {
        let newUrl = `${url}/${nameWithoutExt}`;
        const isDynamic =
          nameWithoutExt.startsWith("[") && nameWithoutExt.endsWith("]");
        isCatchAll =
          nameWithoutExt.startsWith("[...") && nameWithoutExt.endsWith("]");
        isOptionalCatchAll =
          nameWithoutExt.startsWith("[[...") && nameWithoutExt.endsWith("]]");
        const paramName = isDynamic ? nameWithoutExt.slice(1, -1) : null;
        const keyName = isDynamic
          ? `_${paramName.replace("...", "")}`
          : nameWithoutExt;

        let paramType = "string";
        if (isCatchAll || isOptionalCatchAll) {
          paramType = "string[]";
        }

        if (isDynamic) {
          newSlugs.push(paramName.replace("...", ""));
        }

        const child = parseAppDir(
          fullPath,
          indent,
          newSlugs,
          newUrl,
          isCatchAll,
          isOptionalCatchAll,
          exportPaths,
        );

        if (isDynamic) {
          const paramOptional = isOptionalCatchAll ? "?" : "";
          props.push(
            `${indent}${keyName}: (${paramName.replace("...", "")}${paramOptional}: ${paramType}) => (${child})`,
          );
        } else {
          props.push(`${indent}"${keyName}": ${child}`);
        }
      } else if (entry.isFile()) {
        // ファイルがpageファイルの場合のみ$urlを生成
        if (pageFileNames.includes(entry.name)) {
          if (methodOption === "all" || methodOption === "both") {
            const methodAll = createMethodsAll(
              indent,
              newSlugs,
              url,
              isCatchAll || isOptionalCatchAll,
            );
            props.push(methodAll);
          }

          if (methodOption === "one" || methodOption === "both") {
            // 無効な文字を取り除き、変数名として扱えるようにする
            const sanitizedExportKey = sanitizeVariableName(url);

            exportPaths[sanitizedExportKey] = createMethodsOne(
              newSlugs,
              url,
              isCatchAll || isOptionalCatchAll,
            );
          }
        }
      }
    });

  return `{\n${props.join(",\n")}\n${indent}}`;
};

// 出力ファイルを作成する関数
const generatePages = (baseDir) => {
  const exportPaths = {};
  const pagesObjectString = `export const pagesPath = ${parseAppDir(
    baseDir,
    "",
    [],
    "",
    false,
    false,
    exportPaths,
  )};\n\nexport type PagesPath = typeof pagesPath;`;

  // 各パスごとのエクスポートを生成
  const individualExports = Object.keys(exportPaths)
    .map((key) => `export const path${key} = ${exportPaths[key]};`)
    .join("\n\n");

  if (methodOption === "all") {
    return `${generateSuffixFunction}\n\n${pagesObjectString}`;
  } else if (methodOption === "one") {
    return `${generateSuffixFunction}\n\n${individualExports}`;
  } else if (methodOption === "both") {
    return `${generateSuffixFunction}\n\n${pagesObjectString}\n\n${individualExports}`;
  }
};

// 出力ファイルに書き込み
const outputContent = generatePages(baseDir);
fs.writeFileSync(outputPath, outputContent);

console.log(`Generated pagesPath at ${outputPath}`);
