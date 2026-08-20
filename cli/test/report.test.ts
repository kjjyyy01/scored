import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, mkdir, readdir, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { collectSessions, renderReport, pruneOld, writeReport } from "../src/report.ts";
import { user, assistant, file, SEOUL } from "./fixtures.ts";

const DAY = "2026-08-17";
const tmp = () => mkdtemp(join(tmpdir(), "scored-test-"));

test("TC-CLI-003-01: 대상일 세션 2개 → 세션 2블록, 프롬프트·답변 전부 시간순", async () => {
  const sessions = await collectSessions([
    ...file("/p/-Users-me-projects-scored/a.jsonl", [
      user("2026-08-17T10:00:00+09:00", "첫 번째 프롬프트입니다"),
      assistant("2026-08-17T10:01:00+09:00", "m1", { text: "첫 번째 답변입니다" }),
    ]),
    ...file("/p/-Users-me-projects-stackd/b.jsonl", [
      user("2026-08-17T14:00:00+09:00", "두 번째 프롬프트입니다"),
      assistant("2026-08-17T14:01:00+09:00", "m2", { text: "두 번째 답변입니다" }),
    ]),
  ], DAY, SEOUL);
  assert.equal(sessions.length, 2);

  const html = renderReport(sessions, DAY, SEOUL);
  for (const t of ["첫 번째 프롬프트입니다", "첫 번째 답변입니다", "두 번째 프롬프트입니다", "두 번째 답변입니다"])
    assert.ok(html.includes(t), `누락: ${t}`);
  assert.ok(html.indexOf("첫 번째 프롬프트") < html.indexOf("두 번째 프롬프트"), "세션이 시작 시각 순이 아님");
  assert.ok(html.includes("scored · 10:00 · 첫 번째 프롬프트입니다"), "세션 제목 형식 불일치");
});

test("TC-CLI-003-01b: 재개 복제 파일은 세션 블록에서 제외", async () => {
  const shared = [
    user("2026-08-17T10:00:00+09:00", "공유되는 첫 프롬프트"),
    assistant("2026-08-17T10:01:00+09:00", "m1", { text: "답변" }),
  ];
  const sessions = await collectSessions([
    ...file("/p/-Users-me-scored/a.jsonl", shared),
    ...file("/p/-Users-me-scored/b.jsonl", [...shared, user("2026-08-17T10:10:00+09:00", "이어서 한 프롬프트")]),
  ], DAY, SEOUL);
  assert.equal(sessions.length, 1);
  assert.equal(sessions[0]!.file, "/p/-Users-me-scored/b.jsonl");
});

test("TC-CLI-003-02: 답변의 `<script>`는 이스케이프되어 텍스트로 렌더", async () => {
  const sessions = await collectSessions(
    file("/p/-Users-me-scored/a.jsonl", [
      user("2026-08-17T10:00:00+09:00", "XSS 테스트를 해봅시다"),
      assistant("2026-08-17T10:01:00+09:00", "m1", { text: "<script>alert(1)</script>" }),
    ]), DAY, SEOUL);
  const html = renderReport(sessions, DAY, SEOUL);
  assert.ok(!html.includes("<script>alert(1)</script>"), "스크립트가 그대로 실림");
  assert.ok(html.includes("&lt;script&gt;alert(1)&lt;/script&gt;"), "이스케이프 결과 없음");
});

test("TC-CLI-003-04: 첫 프롬프트가 8자 미만이면 프롬프트 수로 폴백", async () => {
  const sessions = await collectSessions(
    file("/p/-Users-me-projects-scored/a.jsonl", [
      user("2026-08-17T10:00:00+09:00", "계속"),
      user("2026-08-17T10:30:00+09:00", "그 다음 작업도 해줘"),
    ]), DAY, SEOUL);
  const html = renderReport(sessions, DAY, SEOUL);
  assert.ok(html.includes("scored · 10:00 · 프롬프트 2개"), "폴백 제목 없음");
});

test("TC-CLI-003-06: 도구 호출은 이름만 접힘, tool_result 원문은 미포함", async () => {
  const toolResultLine = JSON.stringify({
    type: "user", timestamp: "2026-08-17T10:02:00+09:00", uuid: "tr-1",
    message: { role: "user", content: [{ type: "tool_result", tool_use_id: "toolu_Bash", content: "SECRET_TOOL_OUTPUT_XYZ" }] },
  });
  const sessions = await collectSessions(
    file("/p/-Users-me-scored/a.jsonl", [
      user("2026-08-17T10:00:00+09:00", "테스트를 돌려봐"),
      assistant("2026-08-17T10:01:00+09:00", "m1", { text: "돌려보겠습니다", tools: ["Bash", "Read", "Edit"] }),
      toolResultLine,
    ]), DAY, SEOUL);
  const html = renderReport(sessions, DAY, SEOUL);
  assert.ok(!html.includes("SECRET_TOOL_OUTPUT_XYZ"), "tool_result 원문이 실림");
  for (const name of ["Bash", "Read", "Edit"]) assert.ok(html.includes(`▸ ${name}`), `도구 표시 누락: ${name}`);
});

test("TC-CLI-003-05: 7일 롤링 — 범위 밖 날짜 HTML만 삭제, 그 외는 보존", async () => {
  const dir = await tmp();
  await writeFile(join(dir, "2026-08-09.html"), "8일 전 — 삭제 대상");
  await writeFile(join(dir, "2026-08-11.html"), "7일 범위 첫날 — 보존");
  await writeFile(join(dir, "2026-08-17.html"), "대상일 — 보존");
  await writeFile(join(dir, "notes.txt"), "사용자 파일 — 보존");
  await mkdir(join(dir, "2026-08-01.html")); // 이름은 매치하지만 디렉터리 — 보존
  await pruneOld(dir, DAY);
  assert.deepEqual((await readdir(dir)).sort(), ["2026-08-01.html", "2026-08-11.html", "2026-08-17.html", "notes.txt"]);
});

test("writeReport: 0600 권한으로 저장하고 경로를 반환", async () => {
  const dir = await tmp();
  const path = await writeReport(dir, DAY, "<p>본문</p>");
  assert.equal(path, join(dir, "2026-08-17.html"));
  assert.equal((await stat(path)).mode & 0o777, 0o600);
});
