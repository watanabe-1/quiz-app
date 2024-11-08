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
    files: ["*.js", "*.jsx", "*.ts", "*.tsx"],
  },
  {
    ignores: [
      "**/eslint.config.mjs",
      "**/prettier.config.js",
      "**/next.config.mjs",
      "**/tailwind.config.js",
      "**/tsconfig.json",
      "**/postcss.config.mjs",
      "**/next-env.d.ts",
      "**/build/",
      "**/bin/",
      "**/obj/",
      "**/out/",
      "**/.next/",
      // コマンド用ファイル
      "**/generateRoutes.js",
      "**/hashPassword.js",
      "**/generatePromptFromGitDiff.js",
    ],
  },
  {
    name: "eslint/recommended",
    rules: js.configs.recommended.rules,
  },
  ...tseslint.configs.recommended,
  {
    name: "react/jsx-runtime",
    plugins: {
      react: reactPlugin,
    },
    rules: reactPlugin.configs["jsx-runtime"].rules,
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    name: "react-hooks/recommended",
    plugins: {
      "react-hooks": hooksPlugin,
    },
    rules: hooksPlugin.configs.recommended.rules,
  },
  {
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
    // Import rules
    plugins: {
      import: eslintPluginImport,
    },
    rules: {
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling"],
            "index",
            "object",
            "type",
          ],
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },
  {
    // Unused Imports rules
    plugins: {
      "unused-imports": eslintPluginUnusedImports,
    },
    rules: {
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    name: "prettier/config",
    ...eslintConfigPrettier,
  },
  {
    name: "project-custom",
    rules: {
      "@typescript-eslint/no-unused-vars": 1,
    },
  },
];

export default config;
