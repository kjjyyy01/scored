"use client";
// EL-RES-001 공개 연출 스테이지 — 재미 장치 v1의 본체 (BR-007). 타임라인 계산은 reveal.ts가 SSOT
// 카드 바깥·문서 흐름에 둔다: position:fixed면 z-index·스크롤 락·포커스 트랩·backdrop이 따라온다
import { useEffect, useRef } from "react";
import type { Payload } from "../../../cli/src/types.ts";
import { isPartial } from "@/lib/payload.ts";
import { judge } from "@/lib/judge.ts";
import { rows } from "@/lib/rows.ts";
import { GRADE_REEL, easeOutQuart, plan, reelIndex, reelStep } from "@/lib/reveal.ts";
import { Button } from "@/components/ui/button";

export function RevealStage({
  payload,
  entry,
  onFinish,
}: {
  payload: Payload;
  entry: "cli" | "link";
  // cardDur는 여기서 넘긴다 — 모드별 카드 전환 길이를 호출부가 plan()을 다시 돌려 구할 이유가 없다
  onFinish: (skipped: boolean, cardDur: number) => void;
}) {
  const list = rows(payload);
  const partial = isPartial(payload);
  // BR-002: 부분 모드는 판정하지 않는다 → 릴 구간이 데이터로 0이 된다 (분기 아님)
  const finalIdx = partial ? -1 : GRADE_REEL.indexOf(judge(payload).grade);
  const p = plan(entry, partial, list.length);

  const values = useRef<(HTMLElement | null)[]>([]);
  const reel = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  // 스킵·자연 종료가 같은 경로. reveal_completed는 깔때기 지표라 중복 발화 금지
  const finish = (skipped: boolean) => {
    if (done.current) return;
    done.current = true;
    onFinish(skipped, p.cardDur);
  };

  useEffect(() => {
    const t0 = performance.now();
    let raf = 0;
    let face = -1;
    const settled = new Set<number>();

    // 타이머 핸들은 rAF 하나만 — 정리 대상이 하나면 새는 경우도 하나뿐
    const tick = (now: number) => {
      const t = now - t0;

      // 카운트업은 ref의 textContent 직접 갱신 (프레임마다 React 렌더 금지)
      p.rowStart.forEach((start, i) => {
        if (settled.has(i)) return;
        const el = values.current[i];
        if (!el) return;
        const prog = Math.min(1, Math.max(0, (t - start) / p.countDur));
        el.textContent = list[i].text(Math.round(easeOutQuart(prog) * list[i].to));
        if (prog === 1) settled.add(i);
      });

      // 등급 릴 — 인덱스가 바뀔 때만 쓴다
      if (p.reelSteps && reel.current) {
        const next = reelIndex(finalIdx, reelStep(t - p.reelStart, p.reelDur, p.reelSteps), p.reelSteps);
        if (next !== face) {
          face = next;
          reel.current.textContent = GRADE_REEL[next];
        }
      }

      if (t >= p.total) return finish(false);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish(true);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
    };
    // 페이로드는 마운트 시점에 고정 — 연출 도중 바뀌지 않는다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="grid min-h-[60svh] content-center gap-8" aria-label="성적표 공개 연출">
      {/* CPY-RES-001 빌드업 — 지표 진입과 함께 자리를 비운다. pulse와 페이드를 다른 엘리먼트에 걸어 animation 충돌 회피.
          display 스케일은 LCP 요구이기도 하다: 이 문구가 카드 h2(size 17,516)보다 커야(22,861) LCP가
          연출 종료까지 밀리지 않는다 — text-sm이던 시절 entry=cli의 LCP는 3484ms였다 (이슈 #3) */}
      <div style={{ animation: `fade-out 200ms ease-out ${p.rowStart[0] ?? p.total}ms both` }}>
        <p className="animate-pulse text-center text-6xl md:text-7xl font-extrabold tracking-tight text-muted-foreground">
          채점 중…
        </p>
      </div>

      {/* 지표 카운트업 — 최종 표기는 카드와 같은 rows() SSOT.
          연출은 순수 시각 장치라 스크린리더에는 숨긴다 (결과는 카드가 읽어준다) */}
      {p.rowStart.length > 0 && (
        <dl
          aria-hidden="true"
          className="grid grid-cols-1 gap-3"
          // 비트 — 시선을 지표에서 등급으로 넘기는 호흡. 없으면 클라이맥스가 카운트업에 묻힌다
          style={p.reelSteps ? { animation: `dim 100ms ease-out ${p.reelStart - 100}ms both` } : undefined}
        >
          {list.map((row, i) => (
            <div
              key={row.label}
              className="flex items-baseline justify-between gap-4 border-b border-border/60 pb-2 last:border-0 animate-in fade-in-0 slide-in-from-bottom-2"
              // fill-mode: both가 없으면 delay 동안 애니메이션이 미적용이라 "0개"가 처음부터 보인다
              style={{ animationDelay: `${p.rowStart[i]}ms`, animationDuration: `${p.rowDur}ms`, animationTimingFunction: "ease-out", animationFillMode: "both" }}
            >
              <dt className="shrink-0 text-sm text-muted-foreground">{row.label}</dt>
              <dd
                ref={(el) => {
                  values.current[i] = el;
                }}
                className="min-w-0 text-right font-semibold tabular-nums break-words line-clamp-2"
              >
                {row.text(0)}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {/* 등급 릴 — DESIGN.md가 "등급은 색이 아니라 크기·굵기·연출로"를 확정해 모션이 정보 위계를 떠맡는다 */}
      {/* 릴 구간 시작에 맞춰 등장 — 그전에 초기 등급이 보이면 클라이맥스를 미리 흘린다.
          회전과 겹치는 200ms라 타임라인 총합은 불변 */}
      {p.reelSteps > 0 && (
        <div
          aria-hidden="true"
          className="grid justify-items-center gap-2 animate-in fade-in-0"
          style={{ animationDelay: `${p.reelStart}ms`, animationDuration: "200ms", animationFillMode: "both" }}
        >
          {/* CPY-RES-003 — 릴 정지 직전까지만 노출 */}
          <p
            className="text-sm text-muted-foreground"
            style={{ animation: `fade-out 200ms ease-out ${p.popStart}ms both` }}
          >
            오늘의 등급
          </p>
          {/* 등급이 1~2자로 혼재해 폭이 흔들린다 — tabular-nums는 숫자 전용이라 컨테이너에 고정 폭을 준다 */}
          <span
            ref={reel}
            className="animate-pop inline-block min-w-[2.5ch] text-center text-6xl md:text-7xl font-extrabold tracking-tight"
            style={{ animationDelay: `${p.popStart}ms` }}
          >
            {GRADE_REEL[0]}
          </span>
        </div>
      )}

      {/* EL-RES-002 CPY-RES-002 — 스테이지 내 유일 focusable. 포커스는 탈취하지 않는다 (§15) */}
      <Button variant="ghost" className="h-11 w-fit justify-self-center px-5" onClick={() => finish(true)}>
        건너뛰기
      </Button>
    </section>
  );
}
