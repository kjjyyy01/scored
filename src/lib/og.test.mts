import { test } from "node:test";
import assert from "node:assert/strict";
import { parseOg } from "./og.ts";

// 서버 측 검증 (07 쿼리 규약·보안: 사용자 입력 검증) — 필수 t·g·d 불량이면 null → 기본 OG 폴백

test("parseOg: 유효 쿼리 전부 → 객체", () => {
  const r = parseOg(new URLSearchParams("t=swamp&g=B%2B&d=2026-08-22&ip=1&p=47&s=6&k=852200&m=312&tl=Edit"));
  assert.deepEqual(r, { t: "swamp", g: "B+", d: "2026-08-22", ip: true, p: 47, s: 6, k: 852200, m: 312, tl: "Edit" });
});

test("parseOg: 선택 지표 없이 필수 3종만 → 객체 (ip 기본 false)", () => {
  const r = parseOg(new URLSearchParams("t=balance&g=C&d=2026-08-01"));
  assert.deepEqual(r, { t: "balance", g: "C", d: "2026-08-01", ip: false, p: undefined, s: undefined, k: undefined, m: undefined, tl: undefined });
});

test("parseOg: 미정의 유형 코드·등급·날짜 형식 → null", () => {
  assert.equal(parseOg(new URLSearchParams("t=hacker&g=A&d=2026-08-22")), null);
  assert.equal(parseOg(new URLSearchParams("t=night&g=Z&d=2026-08-22")), null);
  assert.equal(parseOg(new URLSearchParams("t=night&g=A&d=22-08-2026")), null);
  assert.equal(parseOg(new URLSearchParams("g=A&d=2026-08-22")), null);
});

test("parseOg: 숫자 아님·음수·과대 지표는 버린다 (필수는 유지)", () => {
  const r = parseOg(new URLSearchParams("t=night&g=A&d=2026-08-22&p=abc&s=-1&k=99999999999&m=10"));
  assert.deepEqual([r?.p, r?.s, r?.k, r?.m], [undefined, undefined, undefined, 10]);
});

test("parseOg: 도구명은 30자 절단 (렌더 폭 방어)", () => {
  const r = parseOg(new URLSearchParams(`t=night&g=A&d=2026-08-22&tl=${"x".repeat(50)}`));
  assert.equal(r?.tl, "x".repeat(30));
});
