// EL-RPT-002 지표 행 — 카드(정적 표기)와 공개 연출(카운트업)이 같은 목록·같은 표기를 쓴다
// 표기가 갈리면 연출 끝과 카드 시작에서 숫자가 튄다 (ANIMATION.md 구현 규칙)
import type { Payload } from "../../cli/src/types.ts";
import { duration, num } from "./format.ts";

// to = 카운트업 종착값, text(to) = 카드가 그리는 최종 문자열
export type Row = { label: string; to: number; text: (v: number) => string };

// 산출 불가한 줄은 통째로 생략 (REQ-RPT-001 AC-5)
export function rows(p: Payload): Row[] {
  const s = p.stats;
  const out: Row[] = [];
  if (typeof s?.prompts === "number") out.push({ label: "프롬프트", to: s.prompts, text: (v) => `${num(v)}개` });
  if (typeof s?.sessions === "number") out.push({ label: "세션", to: s.sessions, text: (v) => `${num(v)}개` });
  if (s?.tokens) out.push({ label: "토큰", to: (s.tokens.in ?? 0) + (s.tokens.out ?? 0), text: num });
  if (typeof s?.activeMinutes === "number") out.push({ label: "활동 시간", to: s.activeMinutes, text: duration });
  const tool = s?.tools?.[0];
  if (tool) out.push({ label: "최다 도구", to: tool[1], text: (v) => `${tool[0]} ${num(v)}회` });
  const sentence = p.highlights?.sentences?.[0];
  if (sentence) out.push({ label: "최다 문장", to: sentence[1], text: (v) => `“${sentence[0]}” ${num(v)}회` });
  return out;
}
