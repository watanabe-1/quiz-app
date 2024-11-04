import nextPlugin from "@next/eslint-plugin-next";
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import eslintPluginImport from "eslint-plugin-import";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import eslintPluginUnusedImports from "eslint-plugin-unused-imports";

export default [
  {
    ignores: ["node_modules/**", ".next/**"], // .nextディレクトリやnode_modulesを無視
  },
  {
    languageOptions: {
      parser: typescriptParser,
    },
    plugins: {
      import: eslintPluginImport,
      "unused-imports": eslintPluginUnusedImports,
      "@typescript-eslint": typescriptEslintPlugin,
      "@next/next": nextPlugin,
      react: reactPlugin,
      "react-hooks": hooksPlugin,
    },
    rules: {
      ...reactPlugin.configs["jsx-runtime"].rules,
      ...hooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "@next/next/no-img-element": "error",
      // import文の順序設定
      "import/order": [
        "warn",
        {
          groups: [
            "builtin", // Nodeの組み込みモジュール
            "external", // npmからインストールしたモジュール
            "internal", // 内部モジュール
            ["parent", "sibling"], // 親・兄弟ファイル
            "index", // 同階層のファイル
            "object", // オブジェクトインポート
            "type", // 型インポート
          ],
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      // 未使用のimportを警告
      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_", // '_'で始まる変数を無視
          args: "after-used",
          argsIgnorePattern: "^_", // '_'で始まる引数を無視
        },
      ],
    },
    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
  },
  prettier,
];
