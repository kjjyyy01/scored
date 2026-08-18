// 05 데이터모델 — 결과 페이로드 스키마 v1 (CLI 생성 · 웹 소비, 단일 계약)
export type Payload = {
  v: 1;
  generatedAt: string; // ISO 8601
  day: string; // YYYY-MM-DD, 로컬 05:00 경계 (BR-011)
  inProgress: boolean;
  stats: {
    prompts: number;
    sessions: number;
    tokens: { in: number; out: number };
    activeMinutes: number;
    models: Record<string, number>;
    tools: [string, number][]; // 상위 10
    hourly: { prompts: number[]; tokens: number[] }; // 길이 24
  };
  week: {
    days: string[]; // 길이 7, 오래된→최근
    prompts: number[];
    tokens: number[];
    heatmap: number[][]; // [요일 0=일][시 0~23]
  };
  fun: {
    nightRatio: number;
    apologies: number;
    maxErrorStreak: number;
    retryScore: number;
    promptStyle: { avgLen: number; oneLinerRatio: number; lenBuckets: number[] };
  };
  highlights?: {
    sentences: [string, number][]; // 상위 3, 반복 ≥2, ≤100자
    words: [string, number][]; // 상위 10
  };
};
