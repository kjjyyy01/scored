import { test } from "node:test";
import assert from "node:assert/strict";
import { weekDelta } from "./dashboard.ts";

// TC-DASH-001-03: (대상일 − 나머지 6일 평균) ÷ 평균 — week 배열은 오래된→최근, 마지막이 대상일

test("TC-DASH-001-03: [10×6, 20] → +100%", () => {
  assert.equal(weekDelta([10, 10, 10, 10, 10, 10, 20]), 100);
});

test("TC-DASH-001-03: [20×6, 10] → -50%", () => {
  assert.equal(weekDelta([20, 20, 20, 20, 20, 20, 10]), -50);
});

test("TC-DASH-001-03: 나머지 6일 평균 0 → null (표기 생략)", () => {
  assert.equal(weekDelta([0, 0, 0, 0, 0, 0, 5]), null);
});

test("TC-DASH-001-03: 소수 평균 — 나머지 평균 (1+2)/6=0.5 → (3−0.5)÷0.5 = +500%", () => {
  assert.equal(weekDelta([1, 2, 0, 0, 0, 0, 3]), 500);
});

test("TC-DASH-001-03: 원소 1개(대상일뿐) → null", () => {
  assert.equal(weekDelta([7]), null);
});
