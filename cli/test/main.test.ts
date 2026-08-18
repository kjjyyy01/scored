import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { main, type Deps } from "../src/main.ts";
import { user, assistant, SEOUL, at } from "./fixtures.ts";

// 가짜 홈 디렉터리 + 출력 수집기
async function fakeHome(withProjects: boolean, lines: string[] = []) {
  const home = await mkdtemp(join(tmpdir(), "scored-"));
  if (withProjects) {
    const dir = join(home, ".claude", "projects", "-Users-me-proj");
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, "s1.jsonl"), lines.join("\n") + "\n");
  }
  return home;
}
function deps(home: string, open: Deps["open"]) {
  const out: string[] = [], err: string[] = [];
  const d: Deps = { home, now: at("2026-08-17T12:00:00+09:00"), tz: SEOUL, open, out: (l) => out.push(l), err: (l) => err.push(l), version: "0.0.0-test" };
  return { d, out, err };
}
const opened: string[] = [];
const openOk = async (u: string) => { opened.push(u); };

test("REQ-CLI-001/002 정상: URL 출력 + 브라우저 오픈 + exit 0", async () => {
  const home = await fakeHome(true, [user("2026-08-17T10:00:00+09:00", "안녕"), assistant("2026-08-17T10:01:00+09:00", "m1", { usage: { input_tokens: 5, output_tokens: 1 } })]);
  const { d, out } = deps(home, openOk);
  assert.equal(await main([], d), 0);
  const url = out.find((l) => l.startsWith("https://scored.kr/report?from=cli#"));
  assert.ok(url, "URL이 출력되어야 함");
  assert.equal(opened.at(-1), url);
  assert.ok(out.some((l) => l.includes("2026-08-17 세션 1개 · 프롬프트 1개")));
});

test("TC-CLI-001-09: ~/.claude/projects 미존재 → ERR-CLI-001, exit 1", async () => {
  const { d, err } = deps(await fakeHome(false), openOk);
  assert.equal(await main([], d), 1);
  assert.ok(err.some((l) => l.includes("~/.claude/projects 폴더를 찾지 못했어요")));
});

test("ERR-CLI-002: 파싱 가능한 세션 0개 → exit 1", async () => {
  const { d, err } = deps(await fakeHome(true, ["{broken", JSON.stringify({ type: "summary" })]), openOk);
  assert.equal(await main([], d), 1);
  assert.ok(err.some((l) => l.includes("분석할 세션이 없어요")));
});

test("TC-CLI-001-10: 브라우저 오픈 실패 → URL은 출력, 안내 문구, exit 0", async () => {
  const home = await fakeHome(true, [user("2026-08-17T10:00:00+09:00", "안녕")]);
  const { d, out, err } = deps(home, async () => { throw new Error("spawn ENOENT"); });
  assert.equal(await main([], d), 0);
  assert.ok(out.some((l) => l.startsWith("https://scored.kr/report?from=cli#")));
  assert.ok(err.some((l) => l.includes("브라우저를 자동으로 열지 못했어요")));
});

test("--help / --version", async () => {
  const { d, out } = deps(await fakeHome(false), openOk);
  assert.equal(await main(["--version"], d), 0);
  assert.equal(out.at(-1), "0.0.0-test");
  assert.equal(await main(["--help"], d), 0);
  assert.ok(out.at(-1)?.includes("npx scored"));
});
