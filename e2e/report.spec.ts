import { test, expect } from "@playwright/test";
import { encodeHash } from "../src/lib/payload.ts";
import { SAMPLE } from "../src/lib/sample.ts";

// 깔때기 2→3단계 = 이 제품의 핵심 플로우. CLI가 만든 URL로 들어와 카드까지 가는 길이다.
// npx 실행 자체는 CLI 테스트(cli/ node:test)가 덮으므로 여기선 해시부터 시작한다
test("CLI 링크로 들어오면 연출을 거쳐 성적표가 나오고, 주소창에 해시가 남지 않는다", async ({ page }) => {
  const hash = await encodeHash(SAMPLE);
  await page.goto(`/report?from=cli#${hash}`);

  // 연출(SCR-002) 진입 — 3~4초 뒤 EL-RES-005 결과 보기가 뜬다
  const reveal = page.getByRole("button", { name: "결과 보기" });
  await expect(reveal).toBeVisible({ timeout: 15_000 });
  await reveal.click();

  // SAMPLE = 에러의 늪 탐험가·B+ (08 §계산 규칙) — 디코딩·판정·카드 렌더가 한 번에 걸린다
  await expect(page.getByRole("heading", { name: "에러의 늪 탐험가" })).toBeVisible();
  await expect(page.getByText(/^B\+ · \d+점$/).first()).toBeVisible(); // EL-RPT-001 등급 뱃지 (공유 카드에도 같은 뱃지가 있어 first)

  // BR-004 프라이버시 게이트 — 페이로드가 주소창·히스토리에 남으면 실패다
  expect(page.url()).not.toContain("#");
  expect(page.url()).not.toContain("from=cli");
});
