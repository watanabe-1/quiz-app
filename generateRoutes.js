// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

// コマンドライン引数の処理
const [baseDir, outputPath, methodOption, printPathnameArg] =
  process.argv.slice(2);
const printPathname = printPathnameArg === "true";

// 引数チェック
const validateArguments = (baseDir, outputPath, methodOption) => {
  if (
    !baseDir ||
    !outputPath ||
    !["all", "one", "both"].includes(methodOption)
  ) {
    console.error(
      "Usage: node generatePagesPath.js <baseDir> <outputPath> <methodOption(all|one|both)> <printPathname(true|false)>",
    );
    process.exit(1);
  }
};
validateArguments(baseDir, outputPath, methodOption);

// 定数の定義
const pageFileNames = ["page.tsx", "page.jsx", "route.ts", "route.js"];
const generateSuffixFunction = `
const generateSuffix = (url?: { query?: Record<string, string | number>, hash?: string }) => {
  if (!url) return "";
  const query = url.query;
  const hash = url?.hash;
  if (!query && !hash) return '';
  const stringQuery: Record<string, string> = query
    ? Object.keys(query).reduce((acc, key) => {
        const value = query[key];
        acc[key] = typeof value === "number" ? String(value) : value;
        return acc;
      }, {} as Record<string, string>)
    : {};
  const search = query ? \`?\${new URLSearchParams(stringQuery)}\` : '';
  return \`\${search}\${hash ? \`#\${hash}\` : ''}\`;
};`;

// 変数名のサニタイズ
const sanitizeVariableName = (name) =>
  name.replace(/\//g, "_").replace(/\[|\]/g, "").replace("...", "___");

// 連番付与
let queryCnt = 0;
const addQueryCnt = (importPath) => `${importPath}_${queryCnt++}`;

// query定義作成
const parseQuery = (outputFile, inputFile) => {
  // ファイルからデータを読み込む
  const fileContents = fs.readFileSync(inputFile, "utf8");

  // Query または OptionalQuery 型が定義されているか確認する
  const queryType = ["Query", "OptionalQuery"].find((type) =>
    new RegExp(`export (interface ${type} ?{|type ${type} ?=)`).test(
      fileContents,
    ),
  );

  // Query または OptionalQuery 型が見つからない場合は終了
  if (!queryType) return;

  // インポートパスを生成
  const relativeImportPath = path
    .relative(path.dirname(outputFile), inputFile)
    .replace(/\\/g, "/") // Windowsパスをスラッシュに変換
    .replace(/(\/index)?\.tsx?$/, ""); // index.ts(x) などを削除

  // インポート名にカウントを追加
  const importAlias = addQueryCnt(queryType);

  // 結果としてインポートに必要な情報を返す
  return {
    importName: importAlias,
    importString: `import { ${queryType} as ${importAlias} } from '${relativeImportPath}';`,
  };
};

// 共通のメソッド生成関数
const createMethods = (
  indent,
  slugs,
  pathname,
  isCatchAll,
  method,
  queryType,
) => {
  const optional = queryType && queryType.startsWith("Query") > 0 ? "" : "?";
  const queryParam = `url${optional}: { query${optional}: ${queryType ? queryType : "Record<string, string | number>"}, hash?: string }`;
  const slugParam = slugs.length ? `query: { ${slugs.join(", ")} },` : "";
  const pathExpression = isCatchAll
    ? `\`${pathname.replace(/\[\[?\.\.\.(.*?)\]\]?/g, (_, p1) => `\${${p1}?.map(encodeURIComponent).join('/') ?? ''}`)}\${generateSuffix(url)}\``
    : `\`${pathname.replace(/\[([^\]]+)\]/g, (_, p1) => `\${encodeURIComponent(${p1})}`)}\${generateSuffix(url)}\``;

  return method === "all"
    ? `${indent}$url: (${queryParam}) => ({${printPathname ? ` pathname: '${pathname}' as const,` : ""} ${slugParam} hash: url?.hash, path: ${pathExpression} })`
    : `(${slugs.map((slug) => `${slug}: ${isCatchAll ? "string[]" : "string | number"}`)}) => {
        return { $url: (${queryParam}) => ({${printPathname ? ` pathname: '${pathname}' as const,` : ""} ${slugParam} hash: url?.hash, path: ${pathExpression} }) };
      }`;
};

// ディレクトリ解析処理
const parseAppDir = (
  input,
  indent = "",
  slugs = [],
  url = "",
  parentCatchAll = false,
  parentOptionalCatchAll = false,
) => {
  indent += "  ";
  const pagesObject = [];
  const exportPaths = {};
  const queries = [];

  const entries = fs
    .readdirSync(input, { withFileTypes: true })
    .filter(
      (entry) =>
        !entry.name.startsWith("_") &&
        !entry.name.startsWith(".") &&
        entry.name !== "node_modules",
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  entries.forEach((entry) => {
    const fullPath = path.join(input, entry.name);
    const nameWithoutExt = entry.isFile()
      ? entry.name.replace(/\.[^/.]+$/, "")
      : entry.name;

    if (entry.isFile() && !pageFileNames.includes(entry.name)) return;

    const newSlugs = [...slugs];
    let isCatchAll = parentCatchAll;
    let isOptionalCatchAll = parentOptionalCatchAll;

    if (entry.isDirectory()) {
      const newUrl = `${url}/${nameWithoutExt}`;
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

      if (isDynamic) newSlugs.push(paramName.replace("...", ""));
      const {
        pagesObjectString: child,
        exportPaths: childExportPaths,
        queries: childQueries,
      } = parseAppDir(
        fullPath,
        indent,
        newSlugs,
        newUrl,
        isCatchAll,
        isOptionalCatchAll,
      );

      Object.assign(exportPaths, childExportPaths);
      queries.push(...childQueries);

      if (methodOption === "all" || methodOption === "both") {
        pagesObject.push(
          isDynamic
            ? `${indent}${keyName}: (${paramName}: ${isCatchAll || isOptionalCatchAll ? "string[]" : "string | number"}) => (${child})`
            : `${indent}"${keyName}": ${child}`,
        );
      }
    } else if (entry.isFile() && pageFileNames.includes(entry.name)) {
      // Query handling
      const queryDef = parseQuery(outputPath, fullPath);
      if (queryDef) queries.push(queryDef);

      if (methodOption === "all" || methodOption === "both") {
        const method = createMethods(
          indent,
          newSlugs,
          url,
          isCatchAll || isOptionalCatchAll,
          "all",
          queryDef ? queryDef.importName : null,
        );
        pagesObject.push(method);
      }
      if (methodOption === "one" || methodOption === "both") {
        const sanitizedExportKey = sanitizeVariableName(url);
        exportPaths[sanitizedExportKey] = createMethods(
          "",
          newSlugs,
          url,
          isCatchAll || isOptionalCatchAll,
          "one",
          queryDef ? queryDef.importName : null,
        );
      }
    }
  });

  return {
    pagesObjectString: `{
${pagesObject.join(",\n")}
${indent}}`,
    exportPaths,
    queries,
  };
};

// ページパス生成
const generatePages = (baseDir) => {
  const { pagesObjectString, exportPaths, queries } = parseAppDir(baseDir);
  const pagesObject = `export const pagesPath = ${pagesObjectString};\n\nexport type PagesPath = typeof pagesPath;`;

  const individualExports = Object.keys(exportPaths)
    .map((key) => `export const path${key} = ${exportPaths[key]};`)
    .join("\n\n");

  const queryImports = queries.length
    ? `${queries.map((query) => query.importString).join("\n")}\n\n`
    : "";

  return `${queryImports}${generateSuffixFunction}${methodOption === "all" || methodOption === "both" ? `\n\n${pagesObject}` : ""}${methodOption === "one" || methodOption === "both" ? `\n\n${individualExports}` : ""}`;
};

// ファイルに出力
const outputContent = generatePages(baseDir);
fs.writeFileSync(outputPath, outputContent);

console.log(`Generated pagesPath at ${outputPath}`);
