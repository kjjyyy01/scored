// 07 GET /api/og 쿼리 검증 — 사용자 입력은 서버 측 검증 (보안 규칙). 실패 = null → 기본 OG 폴백
import type { TypeCode } from "./judge.ts";

const CODES = new Set(["night", "swamp", "retry", "long", "one", "marathon", "balance"]);
const GRADES = new Set(["S", "A+", "A", "B+", "B", "C"]);

export type OgParams = {
  t: TypeCode;
  g: string;
  d: string;
  ip: boolean;
  p?: number;
  s?: number;
  k?: number;
  m?: number;
  tl?: string;
};

export function parseOg(sp: URLSearchParams): OgParams | null {
  const t = sp.get("t");
  const g = sp.get("g");
  const d = sp.get("d");
  if (!t || !CODES.has(t) || !g || !GRADES.has(g) || !d || !/^\d{4}-\d{2}-\d{2}$/.test(d)) return null;
  // 선택 숫자 지표 — 정수·0 이상·10자리 미만만 통과, 불량은 그 값만 버린다
  const num = (key: string): number | undefined => {
    const v = sp.get(key);
    if (v === null) return undefined;
    const n = Number(v);
    return Number.isInteger(n) && n >= 0 && n < 1e10 ? n : undefined;
  };
  return {
    t: t as TypeCode, g, d, ip: sp.get("ip") === "1",
    p: num("p"), s: num("s"), k: num("k"), m: num("m"),
    tl: sp.get("tl")?.slice(0, 30) ?? undefined,
  };
}
