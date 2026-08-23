// TC-LAND-001-01·02 · TC-LAND-002-01
import test from "node:test";
import assert from "node:assert/strict";
import { copyCommand, sendToSelf, NPX_COMMAND } from "./share.ts";

test("TC-LAND-001-01 복사 CTA 클릭 → 클립보드에 CPY-LAND-002 값", async () => {
  let written = "";
  const r = await copyCommand(async (t) => { written = t; }, () => assert.fail("폴백이 돌면 안 된다"));
  assert.equal(written, NPX_COMMAND);
  assert.equal(r, "clipboard");
});

test("TC-LAND-001-02 클립보드 API 실패 → 텍스트 자동 선택 폴백", async () => {
  let selected = false;
  const r = await copyCommand(async () => { throw new Error("denied"); }, () => { selected = true; });
  assert.ok(selected);
  assert.equal(r, "select");
});

test("TC-LAND-002-01 Web Share 미지원 → 클립보드 폴백 + method 구분", async () => {
  let written = "";
  const r = await sendToSelf(undefined, async (t) => { written = t; }, "https://scored.kr");
  assert.equal(r, "clipboard");
  assert.ok(written.includes(NPX_COMMAND) && written.includes("https://scored.kr"));
});

test("Web Share 지원 → share_sheet", async () => {
  const r = await sendToSelf(async () => {}, async () => assert.fail("공유 성공 시 클립보드는 안 쓴다"), "https://scored.kr");
  assert.equal(r, "share_sheet");
});

test("공유 시트 취소 → 클립보드로 폴백", async () => {
  let written = "";
  const r = await sendToSelf(async () => { throw new Error("AbortError"); }, async (t) => { written = t; }, "https://scored.kr");
  assert.equal(r, "clipboard");
  assert.ok(written.includes(NPX_COMMAND));
});
