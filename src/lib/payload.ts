// 06 해시 페이로드 규약 — 디코딩·BR-003 버전 판정·BR-002 부분 모드 (URL 위생은 scrub.ts)
import type { Payload } from "../../cli/src/types.ts";
import { judge } from "./judge.ts";

export const SUPPORTED_V = 1; // 이 값보다 큰 v는 구버전 웹 → ERR-HASH-002 (BR-003)
const MIN_PROMPTS = 10; // BR-002 데이터 부족 경계

export type DecodeResult =
  | { ok: true; payload: Payload }
  // error: null = 해시 부재. 손상이 아니라 Empty 전이라 EVT-RES-003을 발화하지 않는다 (08 §상태전이)
  | { ok: false; error: "ERR-HASH-001" | "ERR-HASH-002" | null };

const FAIL = { ok: false, error: "ERR-HASH-001" } as const;
const NONE = { ok: false, error: null } as const;

// base64url → deflate-raw 해제 → JSON (CLI encode.ts의 역연산)
export async function decodeHash(hash: string): Promise<DecodeResult> {
  const data = hash.replace(/^#/, "");
  if (!data) return NONE;

  let json: string;
  try {
    const bin = atob(data.replace(/-/g, "+").replace(/_/g, "/"));
    const ds = new DecompressionStream("deflate-raw");
    const w = ds.writable.getWriter();
    // 쓰기 쪽 거부는 삼킨다 — 손상 데이터의 실제 에러는 아래 읽기에서 잡힌다 (미처리 거부 방지)
    w.write(Uint8Array.from(bin, (c) => c.charCodeAt(0))).then(() => w.close()).catch(() => {});
    json = await new Response(ds.readable).text();
  } catch {
    return FAIL; // 손상·비압축 데이터
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return FAIL;
  }
  if (!parsed || typeof parsed !== "object") return FAIL;
  const v = (parsed as { v?: unknown }).v;
  if (typeof v !== "number") return FAIL;
  if (v > SUPPORTED_V) return { ok: false, error: "ERR-HASH-002" };
  return { ok: true, payload: parsed as Payload };
}

// BR-002: 프롬프트 10개 미만 → 유형·등급 미판정, 있는 지표만
export const isPartial = (p: Payload): boolean => (p.stats?.prompts ?? 0) < MIN_PROMPTS;

// SCR-005 REQ-SHARE-002 — 공유 URL 생성. CLI encode.ts(deflateRawSync)의 브라우저 짝
export async function encodeHash(p: Payload): Promise<string> {
  const cs = new CompressionStream("deflate-raw");
  const w = cs.writable.getWriter();
  w.write(new TextEncoder().encode(JSON.stringify(p))).then(() => w.close()).catch(() => {}); // 쓰기 거부 삼킴 — decode와 대칭
  const buf = new Uint8Array(await new Response(cs.readable).arrayBuffer());
  let bin = "";
  for (const b of buf) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// REQ-SHARE-003·BR-006: OG 쿼리는 유형·등급·대상일·숫자 지표·도구명만 — 이 함수가 유일한 생성 지점
// 부족 모드는 판정이 없으므로 null → 쿼리 없는 URL = 정적 OG 폴백 (SCR-005 엣지 3)
function ogQuery(p: Payload): string | null {
  if (isPartial(p)) return null;
  const j = judge(p);
  const q = new URLSearchParams({ t: j.type, g: j.grade, d: p.day });
  if (p.inProgress) q.set("ip", "1");
  q.set("p", String(p.stats.prompts));
  q.set("s", String(p.stats.sessions));
  q.set("k", String((p.stats.tokens?.in ?? 0) + (p.stats.tokens?.out ?? 0)));
  q.set("m", String(p.stats.activeMinutes));
  const tool = p.stats.tools?.[0]?.[0];
  if (tool) q.set("tl", tool.slice(0, 30));
  return q.toString();
}

// BR-004: 하이라이트는 명시 토글 ON일 때만 실린다 — 이 함수가 유일한 포함 지점
export async function shareUrl(p: Payload, includeHighlights: boolean, origin: string): Promise<string> {
  const { highlights, ...rest } = p;
  const body = includeHighlights && highlights ? { ...rest, highlights } : rest;
  const og = ogQuery(p);
  return `${origin}/report${og ? `?${og}` : ""}#${await encodeHash(body as Payload)}`;
}
