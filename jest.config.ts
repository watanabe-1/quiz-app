import type { Config } from "jest";
import nextJest from "next/jest.js";
import { path } from "@/lib/path";

const createJestConfig = nextJest({
  dir: path().$url().path,
});

const config: Config = {
  coverageProvider: "v8",
  preset: "ts-jest",
  testEnvironment: "node",
  // Add more setup options before each test is run
  setupFiles: ["dotenv/config"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "@/(.*)$": "<rootDir>/src/$1",
  },
};

export default createJestConfig(config);
