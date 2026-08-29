import { test } from "node:test";
import assert from "node:assert/strict";
import { GRADE_REEL, easeOutQuart, plan, reelIndex, reelStep } from "./reveal.ts";

// ── 등급 릴 착지 — 틀리면 재미 장치의 유일한 클라이맥스가 거짓말한다 (ANIMATION.md) ──

test("릴 마지막 스텝은 모든 등급에서 판정 등급에 착지한다", () => {
  const steps = 16;
  for (let final = 0; final < GRADE_REEL.length; final++) {
    assert.equal(reelIndex(final, steps - 1, steps), final);
  }
});

test("릴은 스텝마다 한 칸씩 순환한다", () => {
  const steps = 16;
  for (let i = 1; i < steps; i++) {
    const prev = reelIndex(2, i - 1, steps);
    assert.equal(reelIndex(2, i, steps), (prev + 1) % GRADE_REEL.length);
  }
});

test("릴 시작 인덱스는 음수 모듈로를 넘겨도 범위 안이다", () => {
  // start = (final - 15) mod 6 이 음수로 새면 릴이 빈 칸을 돈다
  for (let final = 0; final < GRADE_REEL.length; final++) {
    const start = reelIndex(final, 0, 16);
    assert.ok(start >= 0 && start < GRADE_REEL.length, `start=${start}`);
  }
});

// ── 릴 감속 — 감속이 슬롯 느낌의 핵심 ──

test("릴 스텝은 감속한다 — 뒤 스텝일수록 오래 머문다", () => {
  const dur = 800;
  const steps = 16;
  const enter = (s: number) => {
    for (let t = 0; t <= dur; t++) if (reelStep(t, dur, steps) >= s) return t;
    return dur;
  };
  const first = enter(1) - enter(0);
  const last = enter(steps - 1) - enter(steps - 2);
  assert.ok(last > first * 2, `first=${first} last=${last}`);
});

test("릴 스텝은 종료 시각을 넘겨도 마지막 스텝을 유지한다", () => {
  assert.equal(reelStep(800, 800, 16), 15);
  assert.equal(reelStep(9999, 800, 16), 15);
});

// 릴 구간 시작 전에는 rAF가 이미 돌고 있다 — elapsed가 음수로 들어온다
test("릴 스텝은 시작 전(음수 경과)에도 0을 유지한다", () => {
  assert.equal(reelStep(-1550, 800, 16), 0);
  assert.equal(reelStep(-1, 800, 16), 0);
});

test("릴 인덱스는 시작 전에도 실재하는 등급을 가리킨다", () => {
  // 음수 스텝이 새면 GRADE_REEL[음수] = undefined → 릴이 빈칸으로 보인다
  for (let final = 0; final < GRADE_REEL.length; final++) {
    const i = reelIndex(final, reelStep(-1550, 800, 16), 16);
    assert.ok(GRADE_REEL[i] !== undefined, `final=${final} idx=${i}`);
  }
});

test("릴 스텝 0개면 항상 0 — 부분 모드에서 0 나눗셈이 나지 않는다", () => {
  assert.equal(reelStep(0, 0, 0), 0);
  assert.equal(reelStep(500, 0, 0), 0);
});

// ── 카운트업 이징 ──

test("easeOutQuart는 44% 지점에서 90%에 도달한다", () => {
  assert.ok(Math.abs(easeOutQuart(0.44) - 0.9) < 0.005);
  assert.equal(easeOutQuart(0), 0);
  assert.equal(easeOutQuart(1), 1);
});

// ── 타임라인 예산 (ANIMATION.md §공개 연출 타임라인 예산의 검산값) ──

test("풀 연출 총합은 3330ms — 지표 6줄", () => {
  assert.equal(plan("cli", false, 6).total, 3330);
});

test("행이 5줄이면 총합이 3240ms로 자동 감산된다", () => {
  assert.equal(plan("cli", false, 5).total, 3240);
});

test("풀 연출 구간은 빌드업 → 카운트업 → 비트 → 릴 → pop 순서로 겹치지 않는다", () => {
  const p = plan("cli", false, 6);
  assert.equal(p.rowStart[0], 600); // 빌드업 600ms 이후 첫 행
  assert.equal(p.rowStart.at(-1), 600 + 90 * 5);
  assert.equal(p.reelStart, p.rowStart.at(-1)! + p.countDur + 100); // +비트 100
  assert.equal(p.popStart, p.reelStart + p.reelDur);
  assert.equal(p.total, p.popStart + p.popDur);
});

test("link 축약판은 연출 1250ms + 카드 250ms = 1500ms", () => {
  const p = plan("link", false, 6);
  assert.equal(p.total, 1250);
  assert.equal(p.cardDur, 250);
  assert.deepEqual(p.rowStart, []); // 카운트업 전면 생략
});

test("부분 모드는 릴·pop이 데이터로 0이 된다", () => {
  const p = plan("cli", true, 6);
  assert.equal(p.reelSteps, 0);
  assert.equal(p.reelDur, 0);
  assert.equal(p.popDur, 0);
});

test("부분 모드 총합은 행 수로 결정된다 (6→1500 · 4→1340 · 1→1100)", () => {
  assert.equal(plan("cli", true, 6).total, 1500);
  assert.equal(plan("cli", true, 4).total, 1340);
  assert.equal(plan("cli", true, 1).total, 1100);
});

test("link + 부분 모드 겹침은 네 번째 모드를 만들지 않고 500ms 페이드다", () => {
  const p = plan("link", true, 6);
  assert.equal(p.total, 500);
  assert.deepEqual(p.rowStart, []);
  assert.equal(p.reelSteps, 0);
});
