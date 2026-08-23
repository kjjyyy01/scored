// SCR-001 EL-LAND-003 — 샘플 성적표 미리보기용 고정 페이로드
// 이미지가 아니라 실제 StatCard로 그린다: LCP에 이미지 부담 0 + Day 7 유형·등급이 붙으면 여기도 같이 채워진다
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
