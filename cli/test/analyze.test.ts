import { test } from "node:test";
import assert from "node:assert/strict";
import { analyze } from "../src/analyze.ts";
import { user, assistant, toolResult, file, SEOUL, at } from "./fixtures.ts";

const NOW = at("2026-08-17T12:00:00+09:00");

test("TC-CLI-001-01: isMeta·'<'·isSidechain 프롬프트는 카운트 제외, 토큰은 포함", async () => {
  const p = await analyze(
    file("s1.jsonl", [
      user("2026-08-17T10:00:00+09:00", "일반 프롬프트"),
      user("2026-08-17T10:01:00+09:00", "<command-name>/clear</command-name>"),
      user("2026-08-17T10:02:00+09:00", "메타 프롬프트", { isMeta: true }),
      user("2026-08-17T10:03:00+09:00", "서브에이전트 프롬프트", { isSidechain: true }),
      assistant("2026-08-17T10:04:00+09:00", "m1", { usage: { input_tokens: 100, output_tokens: 10 } }, { isSidechain: true }),
    ]),
    { now: NOW, tz: SEOUL },
  );
  assert.equal(p?.stats.prompts, 1);
  assert.deepEqual(p?.stats.tokens, { in: 100, out: 10 });
});

test("TC-CLI-001-02: 동일 message.id 3줄 → usage·model 1회, 도구는 합집합", async () => {
  const p = await analyze(
    file("s1.jsonl", [
      user("2026-08-17T10:00:00+09:00", "프롬프트"),
      assistant("2026-08-17T10:01:00+09:00", "m1", { usage: { input_tokens: 10, cache_creation_input_tokens: 20, cache_read_input_tokens: 30, output_tokens: 5 }, content: [{ type: "thinking", thinking: "" }] }),
      assistant("2026-08-17T10:01:01+09:00", "m1", { usage: { input_tokens: 10, cache_creation_input_tokens: 20, cache_read_input_tokens: 30, output_tokens: 5 }, tools: ["Bash"] }),
      assistant("2026-08-17T10:01:02+09:00", "m1", { usage: { input_tokens: 10, cache_creation_input_tokens: 20, cache_read_input_tokens: 30, output_tokens: 5 }, tools: ["Edit"] }),
    ]),
    { now: NOW, tz: SEOUL },
  );
  assert.deepEqual(p?.stats.tokens, { in: 30, out: 5 }); // cache_read 30은 제외 (input 10 + cache_creation 20)
  assert.deepEqual(p?.stats.models, { "claude-fable-5": 1 });
  assert.deepEqual(p?.stats.tools, [["Bash", 1], ["Edit", 1]]);
});

test("TC-CLI-001-03: 깨진 JSON 줄·알 수 없는 type·필드 누락은 건너뛴다", async () => {
  const p = await analyze(
    file("s1.jsonl", [
      "{not json",
      JSON.stringify({ type: "file-history-snapshot", messageId: "x" }),
      JSON.stringify({ type: "user", message: { role: "user", content: "타임스탬프 없음" } }),
      user("2026-08-17T10:00:00+09:00", "정상 프롬프트"),
      "",
    ]),
    { now: NOW, tz: SEOUL },
  );
  assert.equal(p?.stats.prompts, 1);
});

test("TC-CLI-001-12: 03:30 실행·마지막 프롬프트 02:10 → day = 전날, inProgress = true (05:00 경계)", async () => {
  const p = await analyze(
    file("s1.jsonl", [
      user("2026-08-17T23:50:00+09:00", "밤 프롬프트"),
      user("2026-08-18T02:10:00+09:00", "새벽 프롬프트"),
    ]),
    { now: at("2026-08-18T03:30:00+09:00"), tz: SEOUL },
  );
  assert.equal(p?.day, "2026-08-17");
  assert.equal(p?.inProgress, true);
  assert.equal(p?.stats.prompts, 2);
});

test("TC-CLI-001-12b: 05:00 정각 프롬프트는 당일, 04:59는 전날 — 실행이 다음날이면 inProgress = false", async () => {
  const p = await analyze(
    file("s1.jsonl", [
      user("2026-08-17T04:59:00+09:00", "전날 귀속"),
      user("2026-08-17T05:00:00+09:00", "당일 귀속"),
    ]),
    { now: at("2026-08-18T09:00:00+09:00"), tz: SEOUL },
  );
  assert.equal(p?.day, "2026-08-17");
  assert.equal(p?.stats.prompts, 1);
  assert.equal(p?.inProgress, false);
});

test("TC-CLI-001-04: 로컬 타임존 버킷 — UTC 21:00 = KST 06:00은 새벽 아님, 00~04시만 새벽", async () => {
  const p = await analyze(
    file("s1.jsonl", [
      user("2026-08-16T21:00:00Z", "KST 06:00"), // 06시 → 경계일 2026-08-17
      user("2026-08-17T01:30:00+09:00", "새벽 01:30"), // 경계일 2026-08-16 → 대상일 아님
      user("2026-08-17T23:00:00+09:00", "밤 23:00"),
      user("2026-08-18T04:00:00+09:00", "새벽 04:00"), // 경계일 2026-08-17, 새벽
      assistant("2026-08-17T23:01:00+09:00", "m1", { usage: { input_tokens: 100, output_tokens: 50 } }),
    ]),
    { now: NOW, tz: SEOUL },
  );
  assert.equal(p?.day, "2026-08-17");
  assert.equal(p?.stats.prompts, 3);
  assert.equal(p?.stats.hourly.prompts[6], 1);
  assert.equal(p?.stats.hourly.prompts[23], 1);
  assert.equal(p?.stats.hourly.prompts[4], 1);
  assert.equal(p?.stats.hourly.tokens[23], 150);
  assert.equal(p?.fun.nightRatio, 1 / 3);
});

test("TC-CLI-001-13: 프롬프트 10:00·10:20·12:00 → activeMinutes = 20 (30분 초과 공백 제외)", async () => {
  const p = await analyze(
    file("s1.jsonl", [
      user("2026-08-17T10:00:00+09:00", "a"),
      user("2026-08-17T10:20:00+09:00", "b"),
      user("2026-08-17T12:00:00+09:00", "c"),
    ]),
    { now: NOW, tz: SEOUL },
  );
  assert.equal(p?.stats.activeMinutes, 20);
});

test("TC-CLI-001-05: 연속 is_error 최장 구간 — 세션(파일) 경계에서 리셋, 성공 결과가 끊는다", async () => {
  const p = await analyze(
    [
      ...file("a.jsonl", [
        user("2026-08-17T10:00:00+09:00", "a"),
        toolResult("2026-08-17T10:01:00+09:00", true),
        toolResult("2026-08-17T10:02:00+09:00", true),
        toolResult("2026-08-17T10:03:00+09:00", false),
        toolResult("2026-08-17T10:04:00+09:00", true),
      ]),
      ...file("b.jsonl", [
        user("2026-08-17T11:00:00+09:00", "b"),
        toolResult("2026-08-17T11:01:00+09:00", true),
        toolResult("2026-08-17T11:02:00+09:00", true),
        toolResult("2026-08-17T11:03:00+09:00", true),
      ]),
    ],
    { now: NOW, tz: SEOUL },
  );
  assert.equal(p?.fun.maxErrorStreak, 3);
});

test("TC-CLI-001-14: 7일 중 3일만 활동 → week 길이 7(오래된→최근), 무활동일 0, 히트맵은 경계일 요일", async () => {
  const p = await analyze(
    file("s1.jsonl", [
      user("2026-08-11T10:00:00+09:00", "화 (7일 창의 첫날)"),
      user("2026-08-12T10:00:00+09:00", "수"),
      user("2026-08-15T10:00:00+09:00", "토 1"),
      user("2026-08-15T10:30:00+09:00", "토 2"),
      user("2026-08-17T10:00:00+09:00", "월"),
      user("2026-08-18T02:00:00+09:00", "월 새벽 (경계일 08-17)"),
      assistant("2026-08-15T10:01:00+09:00", "m1", { usage: { input_tokens: 100, output_tokens: 1 } }),
      assistant("2026-08-17T10:01:00+09:00", "m2", { usage: { input_tokens: 200, output_tokens: 2 } }),
    ]),
    { now: NOW, tz: SEOUL },
  );
  assert.deepEqual(p?.week.days, ["2026-08-11", "2026-08-12", "2026-08-13", "2026-08-14", "2026-08-15", "2026-08-16", "2026-08-17"]);
  assert.deepEqual(p?.week.prompts, [1, 1, 0, 0, 2, 0, 2]);
  assert.deepEqual(p?.week.tokens, [0, 0, 0, 0, 101, 0, 202]);
  assert.equal(p?.week.heatmap.length, 7);
  assert.equal(p?.week.heatmap[1]?.length, 24);
  assert.equal(p?.week.heatmap[1]?.[10], 1); // 월 10시
  assert.equal(p?.week.heatmap[1]?.[2], 1); // 월 새벽 2시 (경계일 기준 월요일)
  assert.equal(p?.week.heatmap[6]?.[10], 2); // 토 10시 2개
});

test("§3 fun: 사과(assistant, 중복 제거)·재시도 어휘(user)·프롬프트 스타일", async () => {
  const p = await analyze(
    file("s1.jsonl", [
      user("2026-08-17T10:00:00+09:00", "다시 해줘"), // 5자, 한 줄, 재시도 1
      user("2026-08-17T10:01:00+09:00", "아니 왜 안 되지\n로그 봐줘"), // 15자, 두 줄, 재시도 2
      user("2026-08-17T10:02:00+09:00", "커밋"), // 2자
      assistant("2026-08-17T10:03:00+09:00", "m1", { text: "죄송합니다. 미안해요, 다시 볼게요" }),
      assistant("2026-08-17T10:03:01+09:00", "m1", { text: "죄송합니다. 미안해요, 다시 볼게요" }), // 같은 id·같은 블록 반복 → 1회
      assistant("2026-08-17T10:04:00+09:00", "m2", { text: "죄송" }),
    ]),
    { now: NOW, tz: SEOUL },
  );
  assert.equal(p?.fun.apologies, 3);
  assert.equal(p?.fun.retryScore, 3);
  assert.equal(p?.fun.promptStyle.avgLen, 7); // (5+15+2)/3 = 7.33 → 반올림
  assert.equal(p?.fun.promptStyle.oneLinerRatio, 2 / 3);
  assert.deepEqual(p?.fun.promptStyle.lenBuckets, [3, 0, 0, 0, 0]);
});

test("TC-CLI-001-11: 동일 문장 5회·유사 문장 1회 → sentences에 [문장,5]만 (반복 ≥2), 단어 상위", async () => {
  const lines = [
    ...Array.from({ length: 5 }, (_, i) => user(`2026-08-17T10:0${i}:00+09:00`, "커밋해줘")),
    user("2026-08-17T10:10:00+09:00", "커밋 해줘"),
    user("2026-08-17T10:11:00+09:00", "  다시   테스트  돌려줘.  "), // 정규화: 공백 압축·양끝 문장부호 제거
    user("2026-08-17T10:12:00+09:00", "다시 테스트 돌려줘"),
    user("2026-08-17T10:13:00+09:00", "1 !! ㅋ"), // 1자·숫자·기호 토큰은 단어에서 제외
  ];
  const p = await analyze(file("s1.jsonl", lines), { now: NOW, tz: SEOUL });
  assert.deepEqual(p?.highlights?.sentences, [["커밋해줘", 5], ["다시 테스트 돌려줘", 2]]);
  assert.deepEqual(p?.highlights?.words.slice(0, 2), [["커밋해줘", 5], ["다시", 2]]);
  assert.ok(!p?.highlights?.words.some(([w]) => w === "1" || w === "!!" || w === "ㅋ"));
});

test("§4 불용어·트리밍 (2026-08-24 확정): 양끝 기호 트리밍 → 불용어 소문자 비교 제외, 재미 어휘는 잔존", async () => {
  const lines = [
    user("2026-08-17T10:00:00+09:00", "the THE 그리고 **Claude:** 이제 build"),
    user("2026-08-17T10:01:00+09:00", "build 다시 build"),
  ];
  const p = await analyze(file("s1.jsonl", lines), { now: NOW, tz: SEOUL });
  // the(소문자 비교로 THE도)·그리고·이제 = 불용어 제외 / **Claude:** → Claude 트리밍 / 다시 = 의도적 잔존
  assert.deepEqual(p?.highlights?.words, [["build", 3], ["Claude", 1], ["다시", 1]]);
});

test("TC-CLI-001-06: 자격증명 패턴(BR-005)이 든 문장·단어는 하이라이트에서 제외, 문장은 100자 절단", async () => {
  const long = "가".repeat(120);
  const lines = [
    user("2026-08-17T10:00:00+09:00", "토큰은 sk-abc123 이거 써"),
    user("2026-08-17T10:01:00+09:00", "토큰은 sk-abc123 이거 써"),
    user("2026-08-17T10:02:00+09:00", "ghp_XXXX 로 푸시해"),
    user("2026-08-17T10:03:00+09:00", "ghp_XXXX 로 푸시해"),
    user("2026-08-17T10:04:00+09:00", long),
    user("2026-08-17T10:05:00+09:00", long),
  ];
  const p = await analyze(file("s1.jsonl", lines), { now: NOW, tz: SEOUL });
  assert.deepEqual(p?.highlights?.sentences, [["가".repeat(100), 2]]);
  assert.ok(!p?.highlights?.words.some(([w]) => w.startsWith("sk-") || w.startsWith("ghp_")));
});

test("§3 models: `<synthetic>` 같은 시스템 모델명은 제외", async () => {
  const p = await analyze(
    file("s1.jsonl", [
      user("2026-08-17T10:00:00+09:00", "a"),
      assistant("2026-08-17T10:01:00+09:00", "m1", { model: "claude-fable-5" }),
      assistant("2026-08-17T10:02:00+09:00", "m2", { model: "<synthetic>" }),
    ]),
    { now: NOW, tz: SEOUL },
  );
  assert.deepEqual(p?.stats.models, { "claude-fable-5": 1 });
});

test("TC-CLI-001-15: 세션 재개로 복제된 파일 — 프롬프트 uuid 중복 제거, 세션 1개", async () => {
  // 실측(2026-08-19): 파일 A의 프롬프트가 파일 B에 통째로 복제되고 B가 이어서 씀
  const shared = [
    user("2026-08-17T10:00:00+09:00", "첫 프롬프트입니다"),
    user("2026-08-17T10:05:00+09:00", "두 번째 프롬프트"),
  ];
  const p = await analyze(
    [...file("a.jsonl", shared), ...file("b.jsonl", [...shared, user("2026-08-17T10:10:00+09:00", "세 번째 프롬프트")])],
    { now: NOW, tz: SEOUL },
  );
  assert.equal(p?.stats.prompts, 3); // 5가 아니라 3
  assert.equal(p?.stats.sessions, 1); // a는 b의 재개 복제본
});

test("TC-CLI-001-15b: 프롬프트가 겹치지 않는 두 파일은 각각 별개 세션", async () => {
  const p = await analyze(
    [
      ...file("a.jsonl", [user("2026-08-17T10:00:00+09:00", "레포 A 작업")]),
      ...file("b.jsonl", [user("2026-08-17T11:00:00+09:00", "레포 B 작업")]),
    ],
    { now: NOW, tz: SEOUL },
  );
  assert.equal(p?.stats.prompts, 2);
  assert.equal(p?.stats.sessions, 2);
});

test("TC-CLI-001-17: cache_read_input_tokens는 tokens.in에 합산하지 않는다", async () => {
  // 실측상 cache_read가 전체의 91~97%를 차지해 지표를 지배 — 세션 길이의 함수라 작업량을 못 잰다
  const p = await analyze(
    file("s1.jsonl", [
      user("2026-08-17T10:00:00+09:00", "프롬프트"),
      assistant("2026-08-17T10:01:00+09:00", "m1", {
        usage: { input_tokens: 100, cache_creation_input_tokens: 200, cache_read_input_tokens: 9_000_000, output_tokens: 50 },
      }),
    ]),
    { now: NOW, tz: SEOUL },
  );
  assert.deepEqual(p?.stats.tokens, { in: 300, out: 50 });
  assert.equal(p?.week.tokens.at(-1), 350); // week·hourly도 같은 정의
  assert.equal(p?.stats.hourly.tokens[10], 350);
});
