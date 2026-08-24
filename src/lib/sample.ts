// SCR-001 EL-LAND-003 — 샘플 성적표 미리보기용 고정 페이로드 2장 (2026-08-24 확정)
// 이미지가 아니라 실제 StatCard로 그린다: LCP에 이미지 부담 0
// SAMPLE = 에러의 늪 탐험가·B+(56점), SAMPLE_MARATHON = 마라톤 러너·A(72점) — 08 §계산 규칙 기준
import type { Payload } from "../../cli/src/types.ts";

export const SAMPLE: Payload = {
  v: 1,
  generatedAt: "2026-08-22T23:41:00+09:00",
  day: "2026-08-22",
  inProgress: false,
  stats: {
    prompts: 47,
    sessions: 6,
    tokens: { in: 812_400, out: 39_800 },
    activeMinutes: 312,
    models: { "claude-opus-5": 6 },
    tools: [["Edit", 128], ["Bash", 96], ["Read", 71]],
    hourly: { prompts: Array(24).fill(0), tokens: Array(24).fill(0) },
  },
  week: { days: [], prompts: [], tokens: [], heatmap: [] },
  fun: {
    nightRatio: 0.31,
    apologies: 4,
    maxErrorStreak: 6,
    retryScore: 9,
    promptStyle: { avgLen: 88, oneLinerRatio: 0.44, lenBuckets: [] },
  },
  highlights: { sentences: [["다시 해줘", 7]], words: [] },
};

// 두 번째 카드 (md+ 전용) — 유형·등급이 매일 바뀜을 증명
export const SAMPLE_MARATHON: Payload = {
  v: 1,
  generatedAt: "2026-08-20T22:10:00+09:00",
  day: "2026-08-20",
  inProgress: false,
  stats: {
    prompts: 68,
    sessions: 4,
    tokens: { in: 1_420_000, out: 80_000 },
    activeMinutes: 486,
    models: { "claude-opus-5": 4 },
    tools: [["Bash", 142], ["Read", 88], ["Edit", 63]],
    hourly: { prompts: Array(24).fill(0), tokens: Array(24).fill(0) },
  },
  week: { days: [], prompts: [], tokens: [], heatmap: [] },
  fun: {
    nightRatio: 0.015,
    apologies: 2,
    maxErrorStreak: 2,
    retryScore: 12,
    promptStyle: { avgLen: 145, oneLinerRatio: 0.62, lenBuckets: [] },
  },
  highlights: { sentences: [["계속 진행해", 5]], words: [] },
};
