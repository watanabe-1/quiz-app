import fs from "fs";
import path from "path";

type HTTP_METHODS = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";

// コマンドライン引数の処理
const [baseDir, outputPath] = process.argv.slice(2);

// 引数チェック
const validateArguments = (baseDir: string, outputPath: string) => {
  if (!baseDir || !outputPath) {
    console.error(
      "Usage: node --experimental-strip-types --experimental-transform-types --experimental-detect-module --no-warnings=ExperimentalWarning scripts/generateRpcClient/script.ts  <baseDir> <outputPath>",
    );
    process.exit(1);
  }
};
validateArguments(baseDir, outputPath);

// 定数の定義
const pageFileNames = ["page.tsx", "page.jsx", "route.ts", "route.js"];

const PATH_PATH_STRUCTURE_BASE =
  "./scripts/generateRpcClient/pathStructureBase.ts";
const TYPE_END_POINT = "Endpoint";
const KEY_QUERY = "query";

// 連番付与
const cntObj = {} as Record<string, number>;
const addCnt = (importPath: string, key: string) => {
  if (!cntObj[key]) {
    cntObj[key] = 0;
  }

  return `${importPath}_${cntObj[key]++}`;
};

const getRelativeImportPath = (outputFile: string, inputFile: string) =>
  path
    .relative(path.dirname(outputFile), inputFile)
    .replace(/\\/g, "/") // Windowsパスをスラッシュに変換
    .replace(/(\/index)?\.tsx?$/, ""); // index.ts(x) などを削除

const parseFile = (
  outputFile: string,
  inputFile: string,
  findCallBack: (fileContents: string) => string | undefined,
  typeCallBack: (type: string, asType: string) => string,
) => {
  // ファイルからデータを読み込む
  const fileContents = fs.readFileSync(inputFile, "utf8");

  const MethodType = findCallBack(fileContents);

  // Query または OptionalQuery 型が見つからない場合は終了
  if (!MethodType) return;

  // インポートパスを生成
  const relativeImportPath = getRelativeImportPath(outputFile, inputFile);

  // インポート名にカウントを追加
  const importAlias = addCnt(MethodType, MethodType);

  // 結果としてインポートに必要な情報を返す
  return {
    importName: importAlias,
    importString: `import type { ${MethodType} as ${importAlias} } from '${relativeImportPath}';`,
    type: typeCallBack(MethodType, importAlias),
  };
};

// query定義作成
const parseQuery = (outputFile: string, inputFile: string) => {
  return parseFile(
    outputFile,
    inputFile,
    (fileContents) => {
      return ["Query", "OptionalQuery"].find((type) =>
        new RegExp(`export (interface ${type} ?{|type ${type} ?=)`).test(
          fileContents,
        ),
      );
    },
    (_, asType) => `{${KEY_QUERY}: ${asType}}`,
  );
};

// route定義作成
const parseRoute = (
  outputFile: string,
  inputFile: string,
  httpMethod: HTTP_METHODS,
) => {
  return parseFile(
    outputFile,
    inputFile,
    (fileContents) => {
      const httpMethods = [httpMethod];

      return httpMethods.find((method) =>
        new RegExp(
          `export (async )?(function ${method} ?\\(|const ${method} ?=)`,
        ).test(fileContents),
      );
    },
    (type, asType) => `{ $${type.toLowerCase()}: typeof ${asType}}`,
  );
};

// ディレクトリ解析処理
const parseAppDir = (
  input: string,
  indent = "",
  slugs: string[] = [],
  url = "",
  parentCatchAll = false,
  parentOptionalCatchAll = false,
) => {
  indent += "  ";
  const pagesObject: string[] = [];
  const queries: { importName: string; importString: string }[] = [];
  const types: string[] = [];

  const entries = fs
    .readdirSync(input, { withFileTypes: true })
    .filter((entry) => {
      const { name } = entry;
      // フィルタ条件: 特定の名前やプレフィックスを除外
      if (
        name.startsWith("_") ||
        name.startsWith(".") ||
        name === "node_modules"
      ) {
        return false;
      }

      // ディレクトリの場合、中身が空でないか確認
      if (entry.isDirectory()) {
        const dirPath = path.join(input, name);
        const contents = fs.readdirSync(dirPath);

        return contents.length > 0; // 空のディレクトリは除外
      }

      return true; // ファイルはそのまま通す
    })
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
        ? `_${paramName?.replace("...", "")}`
        : nameWithoutExt;

      if (isDynamic) newSlugs.push(paramName?.replace("...", "") ?? "");
      const { pagesObjectString: child, queries: childQueries } = parseAppDir(
        fullPath,
        indent,
        newSlugs,
        newUrl,
        isCatchAll,
        isOptionalCatchAll,
      );

      queries.push(...childQueries);

      pagesObject.push(
        isDynamic
          ? `${indent}${keyName}: ${child}`
          : `${indent}${keyName}: ${child}`,
      );
    } else if (entry.isFile() && pageFileNames.includes(entry.name)) {
      // Query handling
      const queryDef = parseQuery(outputPath, fullPath);
      if (queryDef) {
        const { importName, importString, type } = queryDef;
        queries.push({ importName, importString });
        types.push(type);
      }

      // Route handling
      const httpMethods: HTTP_METHODS[] = ["GET", "POST"];
      httpMethods.forEach((method) => {
        const routeDef = parseRoute(outputPath, fullPath, method);
        if (routeDef) {
          const { importName, importString, type } = routeDef;
          queries.push({ importName, importString });
          types.push(type);
        }
      });

      types.push(TYPE_END_POINT);
    }
  });

  const typeString = types.join(" & ");

  const pagesObjectString =
    pagesObject.length > 0
      ? `${typeString}${typeString ? " & " : ""}{
    ${pagesObject.join(",\n")}
    ${indent}}`
      : typeString;

  return {
    pagesObjectString,
    queries,
  };
};

// ページパス生成
const generatePages = (baseDir: string) => {
  const pathStructureBase = fs.readFileSync(PATH_PATH_STRUCTURE_BASE, "utf8");
  const importRegex = /import\s+[\s\S]+?from\s+['"][^'"]+['"];\s*/g;
  // import文を取得
  const pathStructureBaseImports: string[] =
    pathStructureBase.match(importRegex) || [];
  // import文を削除したコード
  const pathStructureBaseClean = pathStructureBase.replace(importRegex, "");

  const { pagesObjectString, queries } = parseAppDir(baseDir);
  const pagesObject = `export type PathStructure = ${pagesObjectString};`;

  const queryImports = queries.map((query) => query.importString);
  const imports = queryImports.concat(pathStructureBaseImports);

  const importsStr = queries.length ? `${imports.join("\n")}\n\n` : "";

  return `${importsStr}\n${pathStructureBaseClean}\n${pagesObject}`;
};

// ファイルに出力
const outputContent = generatePages(baseDir);
fs.writeFileSync(outputPath, outputContent);

console.log(`Generated pagesPath at ${outputPath}`);
