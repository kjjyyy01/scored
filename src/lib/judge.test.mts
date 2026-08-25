import { test } from "node:test";
import assert from "node:assert/strict";
import { judge } from "./judge.ts";
import type { Payload } from "../../cli/src/types.ts";

// 05 예시 기준 최소 페이로드 (payload.test.mts와 동일 골격)
const sample = (over: Partial<Payload> = {}): Payload => ({
  v: 1, generatedAt: "2026-08-20T12:00:00.000Z", day: "2026-08-20", inProgress: false,
  stats: { prompts: 23, sessions: 5, tokens: { in: 812000, out: 41000 }, activeMinutes: 312,
    models: { "claude-opus-5": 65 }, tools: [["Bash", 120]], hourly: { prompts: Array(24).fill(0), tokens: Array(24).fill(0) } },
  week: { days: [], prompts: [], tokens: [], heatmap: [] },
  fun: { nightRatio: 0, apologies: 0, maxErrorStreak: 0, retryScore: 0, promptStyle: { avgLen: 40, oneLinerRatio: 0.5, lenBuckets: [0,0,0,0,0] } },
  ...over,
});

// stats 3지표만 바꾼 페이로드
const withStats = (prompts: number, tokens: number, activeMinutes: number): Payload =>
  sample({ stats: { ...sample().stats, prompts, tokens: { in: tokens, out: 0 }, activeMinutes } });

// ── BR-009 등급 커브 (08 §계산 규칙 앵커표에서 수기 계산한 기대값) ──

test("TC-RPT-001-05: 앵커 정중앙 — 20프롬프트·80만·90분 = 각 40점 → 40 B", () => {
  const r = judge(withStats(20, 800_000, 90));
  assert.equal(r.score, 40);
  assert.equal(r.grade, "B");
});

test("TC-RPT-001-05: 마지막 앵커 이상 = 100 → S", () => {
  const r = judge(withStats(200, 20_000_000, 600));
  assert.equal(r.score, 100);
  assert.equal(r.grade, "S");
});

test("TC-RPT-001-05: 첫 앵커 이하 (0,0)→앵커 선형 — 5·20만·15분 = 각 10점 → C", () => {
  const r = judge(withStats(5, 200_000, 15));
  assert.equal(r.score, 10);
  assert.equal(r.grade, "C");
});

test("TC-RPT-001-05: 구간 내 선형 보간 — 35프롬프트=50점·250만=60·270분=60 → 57 B+", () => {
  // (50+60+60)/3 = 56.67 → 반올림 57
  const r = judge(withStats(35, 2_500_000, 270));
  assert.equal(r.score, 57);
  assert.equal(r.grade, "B+");
});

test("TC-RPT-001-05: S 하한 90 — 100+100+70(315분) → S", () => {
  const r = judge(withStats(120, 15_000_000, 315));
  assert.equal(r.score, 90);
  assert.equal(r.grade, "S");
});

test("TC-RPT-001-05: A+ 하한 75 — 100+100+25(45분) → A+", () => {
  const r = judge(withStats(120, 15_000_000, 45));
  assert.equal(r.score, 75);
  assert.equal(r.grade, "A+");
});

test("TC-RPT-001-05: A+ 직하 74 — 100+100+22(36분) → A", () => {
  const r = judge(withStats(120, 15_000_000, 36));
  assert.equal(r.score, 74);
  assert.equal(r.grade, "A");
});

test("TC-RPT-001-05: A 하한 60 — 50·250만·270분 = 각 60점 → A", () => {
  const r = judge(withStats(50, 2_500_000, 270));
  assert.equal(r.score, 60);
  assert.equal(r.grade, "A");
});

// ── BR-010 유형 판정 (임계: night 0.4 / swamp 5 / retry 0.7 / long 1500 / one 0.9 / marathon 480) ──

const withFun = (fun: Partial<Payload["fun"]>, style: Partial<Payload["fun"]["promptStyle"]> = {}): Payload =>
  sample({ fun: { ...sample().fun, ...fun, promptStyle: { ...sample().fun.promptStyle, ...style } } });

test("TC-RPT-001-01: nightRatio 0.5 ≥ 0.4 → night", () => {
  assert.equal(judge(withFun({ nightRatio: 0.5 })).type, "night");
});

test("TC-RPT-001-01: maxErrorStreak 6 ≥ 5 → swamp", () => {
  assert.equal(judge(withFun({ maxErrorStreak: 6 })).type, "swamp");
});

test("TC-RPT-001-01: retryScore 21 ÷ prompts 23 = 0.91 ≥ 0.7 → retry", () => {
  assert.equal(judge(withFun({ retryScore: 21 })).type, "retry");
});

test("TC-RPT-001-01: avgLen 1600 ≥ 1500 → long", () => {
  assert.equal(judge(withFun({}, { avgLen: 1600 })).type, "long");
});

test("TC-RPT-001-01: oneLinerRatio 0.95 ≥ 0.9 → one", () => {
  assert.equal(judge(withFun({}, { oneLinerRatio: 0.95 })).type, "one");
});

test("TC-RPT-001-01: activeMinutes 500 ≥ 480 → marathon", () => {
  const p = sample({ stats: { ...sample().stats, activeMinutes: 500 } });
  assert.equal(judge(p).type, "marathon");
});

test("TC-RPT-001-01: 전 지표 임계 미달 → balance 폴백", () => {
  assert.equal(judge(sample()).type, "balance");
});

test("TC-RPT-001-01: 최고 비율 1개 채택 — night 1.25 < swamp 2.0 → swamp", () => {
  assert.equal(judge(withFun({ nightRatio: 0.5, maxErrorStreak: 10 })).type, "swamp");
});

test("TC-RPT-001-01: 완전 동점은 BR-010 나열 순서 — night 2.0 = swamp 2.0 → night", () => {
  assert.equal(judge(withFun({ nightRatio: 0.8, maxErrorStreak: 10 })).type, "night");
});

// ── CPY-TYPE 문구 선택 (08: day 숫자합 % 풀 크기, 11: 변수 치환) ──

test("EL-RPT-003: 유형명 — night → 새벽 배회자", () => {
  assert.equal(judge(withFun({ nightRatio: 0.5 })).typeName, "새벽 배회자");
});

test("EL-RPT-003: day 2026-08-20 숫자합 20 → 풀 ① + {night}=round(0.5×23)=12 치환", () => {
  const r = judge(withFun({ nightRatio: 0.5 }));
  assert.equal(r.copy, "프롬프트 12개가 새벽 5시 전 — 해 뜨기 전이 제일 뜨거웠습니다");
});

test("EL-RPT-003: day 2026-08-21 숫자합 21 → 풀 ② (동일 입력 = 동일 결과)", () => {
  const p = { ...withFun({ nightRatio: 0.5 }), day: "2026-08-21" };
  assert.equal(judge(p).copy, "남들 잘 때 코딩하는 타입. 새벽의 집중력은 낮의 3배… 라고 믿고 계시죠?");
});

test("EL-RPT-003: marathon {h}/{m} 치환 — 500분 → 8시간 20분", () => {
  const p = sample({ stats: { ...sample().stats, activeMinutes: 500 } });
  assert.equal(judge(p).copy, "활동 8시간 20분 — 오늘은 완주였습니다");
});

test("EL-RPT-003: one {onePct} 치환 — 0.95 → 95%", () => {
  const r = judge(withFun({}, { oneLinerRatio: 0.95 }));
  assert.equal(r.copy, "프롬프트 95%가 한 줄 — 말은 짧게, 일은 많이");
});

test("EL-RPT-003: balance 폴백 문구 ①", () => {
  assert.equal(judge(sample()).copy, "어느 쪽으로도 치우치지 않은 하루 — 육각형 스탯");
});

// ── 랜딩 샘플 역검증 — 픽스처가 규칙 역산값과 일치해야 함 (SCR-001 EL-LAND-003) ──

test("샘플 회귀: SAMPLE = 에러의 늪 탐험가 · B+ 56점", async () => {
  const { SAMPLE } = await import("./sample.ts");
  const r = judge(SAMPLE);
  assert.deepEqual([r.type, r.grade, r.score], ["swamp", "B+", 56]);
});

test("샘플 회귀: SAMPLE_MARATHON = 마라톤 러너 · A 72점", async () => {
  const { SAMPLE_MARATHON } = await import("./sample.ts");
  const r = judge(SAMPLE_MARATHON);
  assert.deepEqual([r.type, r.grade, r.score], ["marathon", "A", 72]);
});
