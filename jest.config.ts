import nextJest from "next/jest.js";
import type { Config } from "jest";

// esモジュールはnode_modulesでも変換の対象とする
const esModules = [
  "next-auth",
  "@auth/core",
  "@panva/hkdf",
  "jose",
  "preact",
  "preact-render-to-string",
  "oauth4webapi",
].join("|");

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  preset: "ts-jest",
  testEnvironment: "node",
  // Add more setup options before each test is run
  setupFiles: ["dotenv/config", "whatwg-fetch"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "@/(.*)$": "<rootDir>/src/$1",
  },
};

// createJestConfigでtransformIgnorePatternsが上書きされてしまうためcreateJestConfigの後にtransformIgnorePatternsは設定する
module.exports = async () => ({
  ...(await createJestConfig(config)()),
  transformIgnorePatterns: [`node_modules/(?!(${esModules})/)`],
});
