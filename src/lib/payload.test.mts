import { test } from "node:test";
import assert from "node:assert/strict";
import { decodeHash, strippedUrl, isPartial, shareUrl } from "./payload.ts";
import type { Payload } from "../../cli/src/types.ts";

// 05 예시 기준 최소 페이로드
const sample = (over: Partial<Payload> = {}): Payload => ({
  v: 1, generatedAt: "2026-08-20T12:00:00.000Z", day: "2026-08-20", inProgress: false,
  stats: { prompts: 23, sessions: 5, tokens: { in: 812000, out: 41000 }, activeMinutes: 312,
    models: { "claude-opus-5": 65 }, tools: [["Bash", 120]], hourly: { prompts: Array(24).fill(0), tokens: Array(24).fill(0) } },
  week: { days: [], prompts: [], tokens: [], heatmap: [] },
  fun: { nightRatio: 0, apologies: 0, maxErrorStreak: 0, retryScore: 0, promptStyle: { avgLen: 40, oneLinerRatio: 0.5, lenBuckets: [0,0,0,0,0] } },
  ...over,
});

// CLI encode.ts와 동일 규약: JSON → deflate-raw → base64url
async function encode(p: unknown): Promise<string> {
  const cs = new CompressionStream("deflate-raw");
  const w = cs.writable.getWriter();
  void w.write(new TextEncoder().encode(JSON.stringify(p)));
  void w.close();
  const buf = new Uint8Array(await new Response(cs.readable).arrayBuffer());
  return btoa(String.fromCharCode(...buf)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

test("TC-RES-001-01: 유효 해시 → 페이로드 객체 복원", async () => {
  const p = sample();
  const r = await decodeHash("#" + (await encode(p)));
  assert.equal(r.ok, true);
  assert.deepEqual(r.ok && r.payload, p);
});

test("TC-RES-001-02: 손상 해시 → ERR-HASH-001", async () => {
  for (const bad of ["#!!!not-base64!!!", "#YWJj"]) {
    const r = await decodeHash(bad);
    assert.equal(r.ok, false, `실패해야 함: ${bad}`);
    assert.equal(!r.ok && r.error, "ERR-HASH-001", `코드 불일치: ${bad}`);
  }
});

// 이슈 #2 — 빈 해시는 손상이 아니라 부재다. 손상으로 흡수하면 result_failed 지표까지 오염된다
test("TC-RES-001-05: 해시 부재 → Empty (error: null, ERR-HASH-001 아님)", async () => {
  for (const none of ["#", ""]) {
    const r = await decodeHash(none);
    assert.equal(r.ok, false, `실패해야 함: ${JSON.stringify(none)}`);
    assert.equal(!r.ok && r.error, null, `부재여야 함: ${JSON.stringify(none)}`);
  }
});

test("TC-RES-001-03: v가 웹 지원 버전 초과 → ERR-HASH-002", async () => {
  const r = await decodeHash("#" + (await encode({ ...sample(), v: 99 })));
  assert.equal(!r.ok && r.error, "ERR-HASH-002");
});

test("TC-RES-001-04: BR-004 — 주소창에서 해시와 ?from 쿼리 제거", () => {
  assert.equal(strippedUrl("https://scored.kr/report?from=cli#abc123"), "https://scored.kr/report");
  assert.equal(strippedUrl("https://scored.kr/report#abc123"), "https://scored.kr/report");
  assert.equal(strippedUrl("https://scored.kr/report?from=cli&utm=x#abc"), "https://scored.kr/report?utm=x");
});

test("TC-RES-003-01: prompts=9 → 부분 모드 (BR-002)", () => {
  assert.equal(isPartial(sample({ stats: { ...sample().stats, prompts: 9 } })), true);
  assert.equal(isPartial(sample({ stats: { ...sample().stats, prompts: 10 } })), false);
});

const WITH_HL = sample({ highlights: { sentences: [["다시 해줘", 7]], words: [["리팩터링", 12]] } });

// TC-SHARE-002-01·02 — 토글에 따른 하이라이트 포함 여부 (BR-004)
test("TC-SHARE-002-01: 토글 OFF → 해시에 highlights 부재", async () => {
  const url = await shareUrl(WITH_HL, false, "https://scored.kr");
  const r = await decodeHash("#" + url.split("#")[1]);
  assert.ok(r.ok);
  assert.equal(r.payload.highlights, undefined);
  assert.equal(r.payload.stats.prompts, WITH_HL.stats.prompts); // 나머지는 그대로
});

test("TC-SHARE-002-02: 토글 ON → 해시에 highlights 포함", async () => {
  const url = await shareUrl(WITH_HL, true, "https://scored.kr");
  const r = await decodeHash("#" + url.split("#")[1]);
  assert.ok(r.ok);
  assert.deepEqual(r.payload.highlights, WITH_HL.highlights);
});

// ── REQ-SHARE-003 동적 OG 쿼리 — BR-006 범위 강제 지점은 shareUrl ──

test("REQ-SHARE-003: 공유 URL에 OG 쿼리 (유형·등급·날짜·숫자 4·도구만)", async () => {
  const url = await shareUrl(sample(), false, "https://scored.kr");
  const q = new URL(url).searchParams;
  // sample(): balance 폴백 · 42+40.6+69.3 평균 51 → B+ (08 커브 수기 계산)
  assert.deepEqual(
    [q.get("t"), q.get("g"), q.get("d"), q.get("p"), q.get("s"), q.get("k"), q.get("m"), q.get("tl")],
    ["balance", "B+", "2026-08-20", "23", "5", "853000", "312", "Bash"],
  );
  assert.equal(q.get("ip"), null); // inProgress=false면 미포함
  assert.equal([...q.keys()].length, 8); // BR-006: 이 외 키 금지 (하이라이트·원문 없음)
});

test("REQ-SHARE-003: 부족 모드(prompts<10)는 쿼리 없음 → 정적 OG 폴백 (SCR-005 엣지 3)", async () => {
  const p = sample({ stats: { ...sample().stats, prompts: 9 } });
  const url = await shareUrl(p, false, "https://scored.kr");
  assert.ok(!url.includes("?"));
});
