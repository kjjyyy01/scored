import { test } from "node:test";
import assert from "node:assert/strict";
import { scrubUrl } from "./scrub.ts";

// BR-004 — 해시에 하이라이트 원문이 실릴 수 있으므로 Sentry로 나가기 전에 잘라야 한다
test("절대 URL — 해시와 ?from 제거, 나머지 쿼리는 보존", () => {
  assert.equal(scrubUrl("https://scored.kr/report?from=cli#PYzBCsIw"), "https://scored.kr/report");
  assert.equal(scrubUrl("https://scored.kr/report?g=A&t=balance#abc"), "https://scored.kr/report?g=A&t=balance");
});

test("상대 경로 — strippedUrl이 throw해도 해시는 잘린다 (폴백)", () => {
  assert.equal(scrubUrl("/report#PYzBCsIw"), "/report");
  assert.equal(scrubUrl("/report"), "/report");
});

test("불량 입력 — 던지지 않는다 (스크럽 실패가 오류 수집을 깨면 안 된다)", () => {
  assert.equal(scrubUrl(""), "");
  assert.equal(scrubUrl("!!not a url!!#해시"), "!!not a url!!");
});
