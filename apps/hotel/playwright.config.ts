import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(".env.local"),
});

export default defineConfig({
  testDir: "tests",
  expect: {
    timeout: 10000,
  },
  projects: [
    {
      name: "setup",
      testMatch: "tests/auth.setup.ts",
    },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "auth.json",
        baseURL: "http://localhost:5173",
      },
      dependencies: ["setup"],
    },
  ],
});
