import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginUnusedImports from "eslint-plugin-unused-imports";

const config = [
  {
    // 対象となるファイルの拡張子を指定
    files: ["*.js", "*.jsx", "*.ts", "*.tsx"],
  },
  {
    // チェックから除外するファイルやディレクトリの指定
    ignores: [
      "**/eslint.config.mjs",
      "**/prettier.config.js",
      "**/next.config.mjs",
      "**/tailwind.config.js",
      "**/tsconfig.json",
      "**/postcss.config.mjs",
      "**/next-env.d.ts",
      "**/build/", // ビルド済みファイル
      "**/bin/", // 実行可能ファイル
      "**/obj/", // オブジェクトファイル
      "**/out/", // 出力ファイル
      "**/.next/", // Next.jsのビルドディレクトリ
      // コマンド用のユーティリティファイル
      "**/generateRoutes.js",
      "**/hashPassword.js",
      "**/generatePromptFromGitDiff.js",
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
    rules: {
      "no-unused-vars": "off", // デフォルトの未使用変数のルールを無効化
      "unused-imports/no-unused-imports": "warn", // 未使用のインポートを警告
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_", // _から始まる変数は無視
          args: "after-used",
          argsIgnorePattern: "^_", // _から始まる引数は無視
        },
      ],
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
    },
  },
];

export default config;
