// 06 해시 페이로드 규약: JSON → deflate-raw → base64url → scored.kr/report?from=cli#<data>
import { deflateRawSync } from "node:zlib";
import type { Payload } from "./types.ts";

export const REPORT_URL = "https://scored.kr/report?from=cli"; // 도메인 하드코딩 (CLI-001 §6)
export const MAX_HASH_CHARS = 8000; // 05 크기 상한 (OQ-004 실측 후 확정)

export const encodePayload = (p: Payload): string => deflateRawSync(JSON.stringify(p), { level: 9 }).toString("base64url");

// 상한 초과 시 highlights를 비우고 1회 재인코딩 (REQ-CLI-001 AC-2). 그래도 초과면 그대로 진행
export function buildUrl(p: Payload): string {
  let data = encodePayload(p);
  if (data.length > MAX_HASH_CHARS && p.highlights) {
    data = encodePayload({ ...p, highlights: undefined });
  }
  return `${REPORT_URL}#${data}`;
}
