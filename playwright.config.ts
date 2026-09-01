import { defineConfig, devices } from "@playwright/test";

// E2E는 핵심 플로우 1개만 (PLAN Day 15~16) — 단위 테스트는 `npm test`(node:test)가 담당한다.
// 브라우저도 chromium 1종: 브라우저 호환은 Day 17 iOS Safari 실기기 순회에서 본다
export default defineConfig({
  testDir: "./e2e",
  use: { baseURL: "http://localhost:3000", trace: "on-first-retry" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // 로컬은 붙어 있는 dev 서버를 재사용, CI는 매번 새로 띄운다
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
