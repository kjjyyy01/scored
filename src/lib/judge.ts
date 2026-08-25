// 웹 판정 모듈 (BR-001) — BR-009 등급·BR-010 유형·CPY-TYPE 문구. SSOT: 08 §계산 규칙
import type { Payload } from "../../cli/src/types.ts";

// 등급 커브 앵커 — [지표값, 점수] 오름차순 (08 §계산 규칙 표)
const CURVES = {
  prompts: [[10, 20], [20, 40], [50, 60], [90, 80], [120, 100]],
  tokens: [[400_000, 20], [800_000, 40], [2_500_000, 60], [7_500_000, 80], [15_000_000, 100]],
  minutes: [[30, 20], [90, 40], [270, 60], [360, 80], [480, 100]],
} as const;

// 앵커 구간 선형 보간 — 첫 앵커 이하는 (0,0)→첫 앵커, 마지막 이상은 100
function curveScore(value: number, anchors: readonly (readonly [number, number])[]): number {
  let [px, py] = [0, 0];
  for (const [x, y] of anchors) {
    if (value <= x) return py + ((value - px) / (x - px)) * (y - py);
    [px, py] = [x, y];
  }
  return 100;
}

const GRADES = [[90, "S"], [75, "A+"], [60, "A"], [45, "B+"], [25, "B"]] as const;

// 유형 코드 (07 `t` 값) — BR-010 나열 순서가 동점 우선순위
export type TypeCode = "night" | "swamp" | "retry" | "long" | "one" | "marathon" | "balance";

// [코드, 지표 추출, 임계] — ratio = 지표 ÷ 임계, 최대 ratio ≥1이면 그 유형, 전부 <1이면 balance.
// prompts ≥ 10 전제 (BR-002가 렌더 진입부에서 차단하므로 retryRatio 0 나눗셈 없음)
const TYPES: [TypeCode, (p: Payload) => number, number][] = [
  ["night", (p) => p.fun.nightRatio, 0.4],
  ["swamp", (p) => p.fun.maxErrorStreak, 5],
  ["retry", (p) => p.fun.retryScore / p.stats.prompts, 0.7],
  ["long", (p) => p.fun.promptStyle.avgLen, 1500],
  ["one", (p) => p.fun.promptStyle.oneLinerRatio, 0.9],
  ["marathon", (p) => p.stats.activeMinutes, 480],
];

// 유형명 + 문구 풀 (11 CPY-TYPE-001~007이 SSOT — v1.x 기간 문구만 수정 가능, BR-001)
const TYPE_COPY: Record<TypeCode, { name: string; pool: [string, string] }> = {
  night: { name: "새벽 배회자", pool: [
    "프롬프트 {night}개가 새벽 5시 전 — 해 뜨기 전이 제일 뜨거웠습니다",
    "남들 잘 때 코딩하는 타입. 새벽의 집중력은 낮의 3배… 라고 믿고 계시죠?",
  ] },
  swamp: { name: "에러의 늪 탐험가", pool: [
    "연속 에러 {streak}회에도 멈추지 않았습니다 — 그게 개발자죠",
    "에러 {streak}연타. 늪은 깊었지만 결국 걸어나왔습니다",
  ] },
  retry: { name: '"다시요" 장인', pool: [
    "'다시'·'아니'·'왜'가 {retry}번 — AI도 진땀 흘린 하루",
    "한 번에 안 되면 될 때까지. 장인은 타협하지 않습니다",
  ] },
  long: { name: "장문 설교자", pool: [
    "평균 프롬프트 {avgLen}자 — AI가 정독하느라 고생했습니다",
    "설명이 긴 게 아니라 맥락이 풍부한 겁니다",
  ] },
  one: { name: "한 줄 사령관", pool: [
    "프롬프트 {onePct}%가 한 줄 — 말은 짧게, 일은 많이",
    "긴 말 안 합니다. 한 줄이면 알아서 하죠",
  ] },
  marathon: { name: "마라톤 러너", pool: [
    "활동 {h}시간 {m}분 — 오늘은 완주였습니다",
    "의자에서 보낸 {h}시간, 성적표가 증명합니다",
  ] },
  balance: { name: "밸런스 코더", pool: [
    "어느 쪽으로도 치우치지 않은 하루 — 육각형 스탯",
    "특이사항 없음이 제일 어렵습니다. 내일은 어떤 유형이 나올까요?",
  ] },
};

// 유형 코드 → 표시명 (OG 이미지 등 판정 없이 이름만 필요한 곳)
export const TYPE_NAMES = Object.fromEntries(
  Object.entries(TYPE_COPY).map(([code, { name }]) => [code, name]),
) as Record<TypeCode, string>;

// 11 변수 치환표 — {night}=새벽 프롬프트 수(비율×전체 반올림)
function vars(p: Payload): Record<string, string> {
  const n = (v: number) => Math.round(v).toLocaleString("ko-KR");
  return {
    night: n(p.fun.nightRatio * p.stats.prompts),
    streak: n(p.fun.maxErrorStreak),
    retry: n(p.fun.retryScore),
    avgLen: n(p.fun.promptStyle.avgLen),
    onePct: n(p.fun.promptStyle.oneLinerRatio * 100),
    h: String(Math.floor(p.stats.activeMinutes / 60)),
    m: String(p.stats.activeMinutes % 60),
  };
}

export type Judged = {
  score: number;
  grade: "S" | "A+" | "A" | "B+" | "B" | "C";
  type: TypeCode;
  typeName: string;
  copy: string;
};

export function judge(p: Payload): Judged {
  const s = p.stats;
  const score = Math.round(
    (curveScore(s.prompts, CURVES.prompts) +
      curveScore(s.tokens.in + s.tokens.out, CURVES.tokens) +
      curveScore(s.activeMinutes, CURVES.minutes)) / 3,
  );
  const grade = GRADES.find(([min]) => score >= min)?.[1] ?? "C";

  let type: TypeCode = "balance";
  let best = 0;
  for (const [code, metric, limit] of TYPES) {
    const ratio = metric(p) / limit;
    if (ratio >= 1 && ratio > best) [type, best] = [code, ratio];
  }

  // 문구 선택: day(YYYY-MM-DD) 숫자합 % 풀 크기 — 동일 입력 = 동일 결과 (08)
  const { name, pool } = TYPE_COPY[type];
  const digitSum = [...p.day.replace(/\D/g, "")].reduce((a, c) => a + +c, 0);
  const v = vars(p);
  const copy = pool[digitSum % pool.length].replace(/\{(\w+)\}/g, (_, k) => v[k] ?? `{${k}}`);

  return { score, grade, type, typeName: name, copy };
}
