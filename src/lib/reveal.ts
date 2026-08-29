// SCR-002 공개 연출의 순수 로직 — 타임라인 예산·릴 착지·이징. 값의 근거는 ANIMATION.md가 SSOT
// DOM·React를 모르는 계산만 둔다 (rAF 루프는 reveal-stage.tsx)

// 릴에 도는 등급 목록 — judge.ts의 Judged["grade"]와 같은 집합·같은 순서(위→아래 하강)
export const GRADE_REEL = ["S", "A+", "A", "B+", "B", "C"] as const;

// 스텝 s에서 보여줄 등급 인덱스. 마지막 스텝이 반드시 판정 등급에 착지한다
// 시작점을 역산하므로 음수 모듈로 방어가 필수 — 틀리면 클라이맥스가 거짓말한다
export function reelIndex(finalIdx: number, step: number, steps: number): number {
  const len = GRADE_REEL.length;
  const start = (((finalIdx - (steps - 1)) % len) + len) % len;
  return (start + step) % len;
}

// 경과 시간 → 스텝 번호. easeOutCubic 감속이 슬롯 느낌의 핵심
// (CSS steps()는 등간격이라 감속이 안 된다). 세제곱은 제곱보다 마지막 스텝을 길게 잡아
// "곧 멈춘다"는 예고가 생긴다 — 2026-08-28 육안 판정에서 제곱은 "너무 빨리 지나간다"로 컷
export function reelStep(elapsed: number, dur: number, steps: number): number {
  if (steps <= 0 || dur <= 0) return 0;
  // 하한 clamp 필수 — 릴 구간 전에도 rAF는 돌고 있어 elapsed가 음수로 들어온다.
  // 새면 음수 스텝 → GRADE_REEL[음수] = undefined → 릴이 빈칸으로 보인다
  const p = Math.min(1, Math.max(0, elapsed / dur));
  return Math.min(steps - 1, Math.floor((1 - (1 - p) ** 3) * steps));
}

// 카운트업 이징 — 초반 44%에 90% 도달, 마지막 자릿수에서 뜸들이는 착지감
export const easeOutQuart = (p: number) => 1 - (1 - p) ** 4;

export type Plan = {
  rowStart: number[]; // 지표 행 진입 + 카운트업 시작 시각 (빈 배열 = 카운트업 생략 모드)
  rowDur: number;
  countDur: number;
  reelStart: number;
  reelDur: number;
  reelSteps: number;
  popStart: number;
  popDur: number;
  total: number; // 연출 종료 — ready 전이 + EVT-RES-002 발화 시점
  cardDur: number; // 카드 전환
};

// 모드별 구간 길이 — ANIMATION.md §공개 연출 타임라인 예산의 표 그대로
// skim = link + 부분 모드 겹침. 네 번째 모드를 만들지 않고 사실상 페이드로 접는다
const BUDGET = {
  full: { buildup: 600, stagger: 90, rowDur: 240, countDur: 700, beat: 100, reelDur: 1100, reelSteps: 16, popDur: 380, cardDur: 350 },
  link: { buildup: 250, stagger: 0, rowDur: 0, countDur: 0, beat: 0, reelDur: 700, reelSteps: 16, popDur: 300, cardDur: 250 },
  // 부분 모드 rowDur 200은 스태거 80과의 겹침 비율을 full(90:240)에 맞춘 값
  partial: { buildup: 500, stagger: 80, rowDur: 200, countDur: 600, beat: 0, reelDur: 0, reelSteps: 0, popDur: 0, cardDur: 300 },
  skim: { buildup: 500, stagger: 0, rowDur: 0, countDur: 0, beat: 0, reelDur: 0, reelSteps: 0, popDur: 0, cardDur: 250 },
} as const;

// 총합을 하드코딩하지 않는다 — 행 수가 줄면 예산도 같이 줄어야 한다
// 부분 모드에서 릴·pop이 0이 되는 것도 분기가 아니라 데이터(BUDGET.partial)다
export function plan(entry: "cli" | "link", partial: boolean, rows: number): Plan {
  const b = BUDGET[entry === "link" ? (partial ? "skim" : "link") : partial ? "partial" : "full"];
  const n = Math.max(1, rows);
  const rowStart = b.countDur ? Array.from({ length: n }, (_, i) => b.buildup + b.stagger * i) : [];
  const countEnd = rowStart.length ? rowStart[rowStart.length - 1] + b.countDur : b.buildup;
  const reelStart = countEnd + b.beat;
  const popStart = reelStart + b.reelDur;
  return {
    rowStart,
    rowDur: b.rowDur,
    countDur: b.countDur,
    reelStart,
    reelDur: b.reelDur,
    reelSteps: b.reelSteps,
    popStart,
    popDur: b.popDur,
    total: popStart + b.popDur,
    cardDur: b.cardDur,
  };
}
