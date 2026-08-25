"use client";
// SCR-004 대시보드 — /report 하단 섹션. 전부 로컬 계산, 차트 라이브러리 금지(CSS/SVG)
// AC-2: 지표별 독립 실패 — 산출 가능한 위젯만 그린다, 빈 껍데기 금지
import { useEffect, useRef } from "react";
import type { Payload } from "../../../cli/src/types.ts";
import { weekDelta } from "@/lib/dashboard.ts";
import { duration, num } from "@/lib/format.ts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const DOW = ["일", "월", "화", "수", "목", "금", "토"];
// 엣지 2: 24h 타임라인은 05시 시작 회전 — 새벽(00~04)이 오른쪽 끝
const rotate = <T,>(a: T[]): T[] => [...a.slice(5), ...a.slice(0, 5)];

function Widget({ title, children, wide = false }: { title: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <Card className={wide ? "md:col-span-2" : ""}>
      <CardHeader>
        <h3 className="text-2xl font-semibold">{title}</h3>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">{children}</CardContent>
    </Card>
  );
}

// EL-DASH-001 — 막대(프롬프트) + 선(토큰), primary 단색+농도 (DESIGN)
function Timeline({ hourly }: { hourly: NonNullable<Payload["stats"]["hourly"]> }) {
  const prompts = rotate(hourly.prompts);
  const tokens = rotate(hourly.tokens);
  const maxP = Math.max(...prompts, 1);
  const maxT = Math.max(...tokens, 1);
  const peak = prompts.indexOf(Math.max(...prompts));
  const line = tokens.map((v, i) => `${i * 10 + 4},${60 - (v / maxT) * 52}`).join(" ");
  return (
    <>
      <svg viewBox="0 0 240 64" preserveAspectRatio="none" className="h-28 w-full" aria-hidden>
        {prompts.map((v, i) => (
          <rect key={i} x={i * 10 + 1} y={60 - (v / maxP) * 52} width={8} height={(v / maxP) * 52} className="fill-primary" opacity={0.85} />
        ))}
        <polyline points={line} fill="none" strokeWidth={1.5} className="stroke-primary" opacity={0.35} />
        <line x1="0" y1="60" x2="240" y2="60" className="stroke-border" strokeWidth={1} />
      </svg>
      <div className="grid grid-cols-4 text-xs text-muted-foreground">
        <span>05시</span><span>11시</span><span>17시</span><span>23시</span>
      </div>
      {/* §15: 차트 수치 텍스트 대체 */}
      <p className="sr-only">
        시간대별 프롬프트 — 가장 활발한 시간 {((peak + 5) % 24).toString().padStart(2, "0")}시, {num(Math.max(...prompts))}개
      </p>
    </>
  );
}

// 7일 미니 막대 1줄 — EL-DASH-002 절반 (프롬프트·토큰 공용)
function WeekRow({ label, values, days }: { label: string; values: number[]; days: string[] }) {
  const max = Math.max(...values, 1);
  const delta = weekDelta(values);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-sm text-muted-foreground">{label}</span>
        {/* TC-DASH-001-03: 평균 0이면 표기 생략 */}
        {delta !== null && (
          <span className="text-sm font-semibold tabular-nums">이번 주 평균 대비 {delta >= 0 ? "+" : ""}{num(delta)}%</span>
        )}
      </div>
      <div className="flex h-12 items-end gap-1" aria-hidden>
        {values.map((v, i) => (
          <div key={i} className="flex-1 rounded-sm bg-primary" style={{ height: `${Math.max((v / max) * 100, 2)}%`, opacity: i === values.length - 1 ? 1 : 0.45 }} />
        ))}
      </div>
      <p className="sr-only">{label} 7일: {values.map((v, i) => `${days[i] ?? ""} ${num(v)}`).join(", ")}</p>
    </div>
  );
}

// EL-DASH-002 히트맵 — 요일×시간, 농도 = 값/최대
function Heatmap({ heatmap }: { heatmap: number[][] }) {
  const max = Math.max(...heatmap.flat(), 1);
  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-md flex-col gap-1" aria-hidden>
        {heatmap.map((row, d) => (
          <div key={d} className="flex items-center gap-1">
            <span className="w-4 shrink-0 text-xs text-muted-foreground">{DOW[d]}</span>
            {row.map((v, h) => (
              <div key={h} className="aspect-square flex-1 rounded-[2px] bg-primary" style={{ opacity: v ? 0.15 + (v / max) * 0.85 : 0.04 }} />
            ))}
          </div>
        ))}
      </div>
      <p className="sr-only">요일×시간 히트맵 — 최다 구간 {num(max)}개 프롬프트</p>
    </div>
  );
}

// 가로 막대 랭킹 — EL-DASH-003 도구·EL-DASH-006 길이 분포 공용
function Bars({ rows }: { rows: [string, number][] }) {
  const max = Math.max(...rows.map(([, v]) => v), 1);
  return (
    <dl className="flex flex-col gap-2">
      {rows.map(([label, v]) => (
        <div key={label} className="grid grid-cols-[7rem_1fr_auto] items-center gap-3">
          <dt className="truncate text-sm text-muted-foreground">{label}</dt>
          <div aria-hidden className="h-2.5 rounded-sm bg-primary" style={{ width: `${(v / max) * 100}%`, opacity: 0.85 }} />
          <dd className="text-sm font-semibold tabular-nums">{num(v)}</dd>
        </div>
      ))}
    </dl>
  );
}

const BUCKET_LABELS = ["20자 미만", "20~49자", "50~99자", "100~199자", "200자 이상"]; // 05 lenBuckets 경계

export function Dashboard({ payload, entry, onFirstView }: { payload: Payload; entry: "cli" | "link"; onFirstView: () => void }) {
  const headRef = useRef<HTMLHeadingElement>(null);
  const p = payload;
  const s = p.stats;
  const fun = p.fun;

  // EVT-DASH-001 — 섹션 첫 노출 시 1회. 관찰 대상은 섹션 제목(섹션 전체는 뷰포트보다 길어 50%에 못 미친다)
  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { onFirstView(); io.disconnect(); } },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
    // onFirstView는 마운트 시점 값으로 충분 (1회성)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // AC-2 빈 껍데기 금지 — 형태가 맞아도 전부 0이면(샘플·무활동) 위젯 자체를 생략
  const sum = (a?: number[]) => (a ?? []).reduce((x, y) => x + y, 0);
  const hourlyOk = s?.hourly?.prompts?.length === 24 && s.hourly.tokens?.length === 24 && sum(s.hourly.prompts) > 0;
  const weekOk = p.week?.prompts?.length === 7 && p.week.tokens?.length === 7 && sum(p.week.prompts) > 0;
  const heatmapOk = Array.isArray(p.week?.heatmap) && p.week.heatmap.length === 7 && sum(p.week.heatmap.flat()) > 0;
  const buckets = fun?.promptStyle?.lenBuckets;
  const sentences = p.highlights?.sentences ?? [];
  const words = p.highlights?.words ?? [];

  // EL-DASH-004 — 카드(SCR-003)에 없는 지표만
  const tiles: [string, string][] = [];
  if (typeof s?.sessions === "number") tiles.push(["세션", num(s.sessions)]);
  if (typeof s?.activeMinutes === "number") tiles.push(["활동 시간", duration(s.activeMinutes)]);
  if (typeof fun?.apologies === "number") tiles.push(["AI의 사과", `${num(fun.apologies)}번`]);
  if (typeof fun?.maxErrorStreak === "number") tiles.push(["최장 연속 에러", `${num(fun.maxErrorStreak)}회`]);
  if (typeof fun?.retryScore === "number") tiles.push(['"다시" 어휘', `${num(fun.retryScore)}번`]);

  return (
    <section id="dashboard" aria-labelledby="dash-heading" className="flex flex-col gap-6">
      <h2 id="dash-heading" ref={headRef} className="text-2xl font-semibold">
        오늘의 기록
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {hourlyOk && (
          <Widget title="24시간 타임라인" wide>
            <Timeline hourly={s.hourly} />
          </Widget>
        )}

        {weekOk && (
          <Widget title="이번 주 추이" wide>
            <WeekRow label="프롬프트" values={p.week.prompts} days={p.week.days ?? []} />
            <WeekRow label="토큰" values={p.week.tokens} days={p.week.days ?? []} />
            {heatmapOk && <Heatmap heatmap={p.week.heatmap} />}
          </Widget>
        )}

        {tiles.length > 0 && (
          <Widget title="기본 스탯">
            <dl className="grid grid-cols-2 gap-4">
              {tiles.map(([label, value]) => (
                <div key={label} className="flex flex-col gap-1">
                  <dt className="text-sm text-muted-foreground">{label}</dt>
                  <dd className="text-2xl font-semibold tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>
          </Widget>
        )}

        {(s?.tools?.length > 0 || Object.keys(s?.models ?? {}).length > 0) && (
          <Widget title="도구·모델">
            {s.tools?.length > 0 && <Bars rows={s.tools.slice(0, 5)} />}
            {Object.keys(s.models ?? {}).length > 0 && (
              <p className="text-sm text-muted-foreground">
                모델: {Object.entries(s.models).map(([m, n]) => `${m} ${num(n)}회`).join(" · ")}
              </p>
            )}
          </Widget>
        )}

        {(buckets?.length === 5 || sentences.length > 0 || words.length > 0) && (
          <Widget title="프롬프트 스타일" wide>
            {buckets?.length === 5 && (
              <>
                <Bars rows={buckets.map((v, i) => [BUCKET_LABELS[i], v] as [string, number])} />
                {typeof fun.promptStyle.oneLinerRatio === "number" && (
                  <p className="text-sm text-muted-foreground">
                    한 줄 프롬프트 비율 {Math.round(fun.promptStyle.oneLinerRatio * 100)}% · 평균 {num(fun.promptStyle.avgLen)}자
                  </p>
                )}
              </>
            )}
            {/* EL-DASH-006 하이라이트 — plain text 렌더(XSS는 React 이스케이프) */}
            {sentences.length > 0 && (
              <ol className="flex list-decimal flex-col gap-1 pl-5">
                {sentences.map(([text, n]) => (
                  <li key={text} className="text-sm">
                    <span className="break-words">“{text}”</span>{" "}
                    <span className="text-muted-foreground tabular-nums">{num(n)}회</span>
                  </li>
                ))}
              </ol>
            )}
            {words.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {words.map(([w, n]) => (
                  <Badge key={w} variant="secondary" className="max-w-48 truncate tabular-nums">
                    {w} ×{num(n)}
                  </Badge>
                ))}
              </div>
            )}
          </Widget>
        )}
      </div>

      {/* EL-DASH-007 — entry=cli만: 수신자 컴퓨터엔 이 파일이 없다 (REQ-DASH-002) */}
      {entry === "cli" && (
        <p className="text-sm text-muted-foreground">
          오늘 대화 전체는 내 컴퓨터에 열렸어요 — <code className="font-mono">~/.scored/{p.day}.html</code>
        </p>
      )}

      {/* EL-DASH-005 — href="#top"은 앵커 부재 시 문서 최상단 (HTML 표준) */}
      <a href="#top" className="w-fit text-sm text-muted-foreground underline-offset-4 hover:underline">
        ↑ 맨 위로
      </a>
    </section>
  );
}
