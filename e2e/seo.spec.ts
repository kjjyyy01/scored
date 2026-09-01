import { test, expect } from "@playwright/test";

// 04 §메타데이터·색인 규약의 회귀 방지. 메타데이터는 조용히 사라지는 종류라 Day 17 육안 검수만으로는 부족하다
const CANONICAL: [string, string][] = [
  ["/", "https://scored.kr"],
  ["/?from=report", "https://scored.kr"], // 쿼리는 별개 문서가 아니다
  ["/how", "https://scored.kr/how"],
  ["/report?from=cli", "https://scored.kr/report"],
];

for (const [path, expected] of CANONICAL) {
  test(`canonical: ${path} → ${expected}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", expected);
  });
}

test("랜딩 JSON-LD는 SoftwareApplication이고, /report에는 JSON-LD가 없다", async ({ page }) => {
  await page.goto("/");
  const raw = await page.locator('script[type="application/ld+json"]').textContent();
  expect(JSON.parse(raw!)["@type"]).toBe("SoftwareApplication");

  // 성적표 값은 전부 해시에서 나온 개인 데이터 — 구조화 데이터로 새면 14 §5 우회 경로가 된다
  await page.goto("/report");
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);
});
