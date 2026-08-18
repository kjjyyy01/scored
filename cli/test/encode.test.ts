import { test } from "node:test";
import assert from "node:assert/strict";
import { encodePayload, buildUrl, MAX_HASH_CHARS } from "../src/encode.ts";
import type { Payload } from "../src/types.ts";
import { createHash } from "node:crypto";

// 압축이 안 되는 결정적 문자열 (sha256 체인)
const noise = (seed: string, n: number) => { let out = "", h = seed; while (out.length < n) { h = createHash("sha256").update(h).digest("hex"); out += h; } return out.slice(0, n); };

// 웹 디코더와 동일한 프리미티브(DecompressionStream deflate-raw)로 역변환 — 06 규약
async function webDecode(data: string): Promise<unknown> {
  const bin = Buffer.from(data, "base64url");
  const stream = new Blob([bin]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  return JSON.parse(await new Response(stream).text());
}

const sample: Payload = {
  v: 1, generatedAt: "2026-08-17T03:00:00.000Z", day: "2026-08-17", inProgress: true,
  stats: { prompts: 53, sessions: 6, tokens: { in: 812000, out: 41000 }, activeMinutes: 312, models: { "claude-fable-5": 140 }, tools: [["Bash", 120], ["Edit", 44]], hourly: { prompts: Array(24).fill(1), tokens: Array(24).fill(1000) } },
  week: { days: ["2026-08-11", "2026-08-12", "2026-08-13", "2026-08-14", "2026-08-15", "2026-08-16", "2026-08-17"], prompts: [51, 103, 74, 9, 106, 16, 53], tokens: [1, 2, 3, 4, 5, 6, 7], heatmap: Array.from({ length: 7 }, () => Array(24).fill(0)) },
  fun: { nightRatio: 0.31, apologies: 7, maxErrorStreak: 4, retryScore: 12, promptStyle: { avgLen: 42, oneLinerRatio: 0.7, lenBuckets: [12, 20, 11, 7, 3] } },
  highlights: { sentences: [["커밋해줘", 9]], words: [["다시", 14], ["왜", 8]] },
};

test("TC-CLI-001-07: 인코딩 라운드트립 — 웹 디코더(deflate-raw)와 동일 객체, URL에 ?from=cli", async () => {
  const data = encodePayload(sample);
  assert.deepEqual(await webDecode(data), sample);
  const url = buildUrl(sample);
  assert.ok(url.startsWith("https://scored.kr/report?from=cli#"));
  assert.deepEqual(await webDecode(url.split("#")[1]!), sample);
});

test("TC-CLI-001-08: 05 크기 상한 초과 → highlights 제거 후 재인코딩", async () => {
  const fat: Payload = { ...sample, highlights: { sentences: [["가".repeat(100), 2], ["나".repeat(100), 2], ["다".repeat(100), 2]], words: Array.from({ length: 10 }, (_, i) => [noise(String(i), 1200), 1]) } };
  assert.ok(encodePayload(fat).length > MAX_HASH_CHARS, "픽스처가 상한을 넘어야 함");
  const url = buildUrl(fat);
  const decoded = (await webDecode(url.split("#")[1]!)) as Payload;
  assert.equal(decoded.highlights, undefined);
  assert.equal(decoded.stats.prompts, 53);
});
