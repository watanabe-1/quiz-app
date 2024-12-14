import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginImport from "eslint-plugin-import";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import eslintPluginUnusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

/** @type {import("eslint").Linter.Config[]} */
const config = [
  {
    // 対象となるファイルの拡張子を指定
    files: ["*.js", "*.jsx", "*.ts", "*.tsx"],
  },
  {
    // チェックから除外するファイルやディレクトリの指定
    ignores: [
      "**/next-env.d.ts",
      "**/build/", // ビルド済みファイル
      "**/bin/", // 実行可能ファイル
      "**/obj/", // オブジェクトファイル
      "**/out/", // 出力ファイル
      "**/.next/", // Next.jsのビルドディレクトリ
    ],
  },
  {
    // JavaScriptの基本的な推奨ルールを適用
    name: "eslint/recommended",
    rules: js.configs.recommended.rules,
  },
  // TypeScript用の推奨ルールを適用
  ...tseslint.configs.recommended,
  {
    // ReactのJSXランタイム用設定
    name: "react/jsx-runtime",
    plugins: {
      react: reactPlugin,
    },
    rules: reactPlugin.configs["jsx-runtime"].rules,
    settings: {
      react: {
        version: "detect", // Reactのバージョンを自動検出
      },
    },
  },
  {
    // React Hooksの推奨ルールを適用
    name: "react-hooks/recommended",
    plugins: {
      "react-hooks": hooksPlugin,
    },
    rules: hooksPlugin.configs.recommended.rules,
  },
  {
    // Next.jsのコアWebバイタルルールを適用
    name: "next/core-web-vitals",
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
  {
    // import順序のルール設定
    plugins: {
      import: eslintPluginImport,
    },
    rules: {
      "import/order": [
        "error",
        {
          groups: [
            "builtin", // 組み込みモジュール
            "external", // 外部モジュール
            "internal", // 内部モジュール
            ["parent", "sibling"], // 親フォルダ・兄弟フォルダからのインポート
            "index", // インデックスファイル
            "object", // オブジェクトスタイルのインポート
            "type", // TypeScriptの型インポート
          ],
          alphabetize: { order: "asc", caseInsensitive: true }, // インポートをアルファベット順にソート
        },
      ],
    },
  },
  {
    // 未使用インポートの削除ルール設定
    plugins: {
      "unused-imports": eslintPluginUnusedImports,
    },
  },
  {
    // Prettierとの競合を防ぐための設定
    name: "prettier/config",
    ...eslintConfigPrettier,
  },
  {
    // プロジェクト固有のカスタムルール
    name: "project-custom",
    rules: {
      eqeqeq: "error", // 厳密な等価演算子（===）を使用
      "react/jsx-boolean-value": ["error", "never"], // boolean propsに値を指定しない形を推奨 (例: <Component isActive />)
      "react/jsx-curly-brace-presence": "error", // JSX内の{}を最小限に
      "react/jsx-pascal-case": "error", // コンポーネントにはパスカルケースで命名
      "react/self-closing-comp": "error", // 子要素のない要素は自己終了タグに変更 (例: <img />)
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "*", next: "return" },
      ], // returnの前には1行開ける ただし、returnのみ1行の関数の場合は空行はいらない
    },
  },
];

export default config;
