// 세션 로그(JSONL 줄) → 05 페이로드 집계 (CLI-001 §2·§3·§4)
import type { Payload } from "./types.ts";
import { boundaryDay, localHour, shiftDay, weekday } from "./time.ts";

export type Line = [file: string, line: string];
export type Input = Iterable<Line> | AsyncIterable<Line>;
export type Options = { now: Date; tz: string };

// 관대한 파싱: 한 줄 → 정규화 레코드 (실패·무관 타입은 null)
type Raw =
  | { type: "user"; ts: number; text: string | null; results: boolean[] }
  | { type: "assistant"; ts: number; id: string; model?: string; usage: { in: number; out: number }; tools: [id: string, name: string][]; texts: string[] };

export function parseLine(line: string): Raw | null {
  if (!line) return null;
  let o: Record<string, unknown>;
  try { o = JSON.parse(line); } catch { return null; }
  if (!o || typeof o !== "object" || !o.message || typeof o.message !== "object") return null;
  const ts = Date.parse(String(o.timestamp));
  if (Number.isNaN(ts)) return null;
  const msg = o.message as Record<string, unknown>;
  const c = msg.content as unknown;
  if (o.type === "user") {
    let text: string | null = null;
    const results: boolean[] = [];
    if (typeof c === "string") text = c;
    else if (Array.isArray(c)) {
      const t = c.filter((b): b is { text: string } => b?.type === "text" && typeof b.text === "string").map((b) => b.text);
      if (t.length) text = t.join("\n");
      for (const b of c) if (b?.type === "tool_result") results.push(b.is_error === true);
    }
    // 프롬프트 제외 규칙: isMeta · '<' 시작 · isSidechain (CLI-001 §2)
    if (text !== null && (o.isMeta === true || o.isSidechain === true || text.startsWith("<"))) text = null;
    return { type: "user", ts, text, results };
  }
  if (o.type === "assistant") {
    const u = (msg.usage ?? {}) as Record<string, number | undefined>;
    const tools: [string, string][] = [];
    const texts: string[] = [];
    if (Array.isArray(c))
      for (const b of c) {
        if (b?.type === "tool_use" && typeof b.name === "string") tools.push([String(b.id ?? b.name), b.name]);
        else if (b?.type === "text" && typeof b.text === "string") texts.push(b.text);
      }
    return {
      type: "assistant", ts, id: String(msg.id ?? o.uuid ?? ts), model: typeof msg.model === "string" ? msg.model : undefined,
      usage: { in: (u.input_tokens ?? 0) + (u.cache_creation_input_tokens ?? 0) + (u.cache_read_input_tokens ?? 0), out: u.output_tokens ?? 0 },
      tools, texts,
    };
  }
  return null;
}

// BR-005 자격증명 패턴 — 이 목록이 SSOT (08 도메인규칙)
const CREDENTIAL = /sk-|ghp_|AKIA|-----BEGIN|Bearer /;

// §4 하이라이트: 최다 사용 문장(반복 ≥2, 상위 3, ≤100자)·단어(2자 이상, 상위 10)
export function highlights(texts: string[]): NonNullable<Payload["highlights"]> {
  const sentences = new Map<string, number>();
  const words = new Map<string, number>();
  for (const text of texts) {
    for (const raw of text.split("\n")) {
      const line = raw.replace(/\s+/g, " ").replace(/^[\p{P}\p{S}\s]+|[\p{P}\p{S}\s]+$/gu, "");
      if (!line || CREDENTIAL.test(line)) continue;
      sentences.set(line, (sentences.get(line) ?? 0) + 1);
    }
    for (const w of text.split(/\s+/)) {
      if (w.length < 2 || /^[\d\p{P}\p{S}]+$/u.test(w) || CREDENTIAL.test(w)) continue;
      words.set(w, (words.get(w) ?? 0) + 1);
    }
  }
  const rank = (m: Map<string, number>) => [...m].sort((a, b) => b[1] - a[1]);
  return {
    sentences: rank(sentences).filter(([, n]) => n >= 2).slice(0, 3).map(([t, n]) => [t.slice(0, 100), n]),
    words: rank(words).slice(0, 10),
  };
}

type Prompt = { file: string; ts: number; text: string };
type ToolResult = { file: string; ts: number; isError: boolean };
type Msg = { file: string; ts: number; model?: string; usage: { in: number; out: number }; tools: Map<string, string>; blocks: Map<string, number> };

export async function analyze(input: Input, { now, tz }: Options): Promise<Payload | null> {
  // ponytail: 전 기록을 압축 형태로 메모리 보관 (30일 로그 932MB 실측 2.5s·RSS 280MB).
  // 느려지면 파일 mtime 내림차순 읽기 + "최신 프롬프트 − 8일" 이전 파일 조기 중단으로 교체
  const prompts: Prompt[] = [];
  const msgs = new Map<string, Msg>(); // message.id 기준 중복 제거
  const results: ToolResult[] = [];

  for await (const [file, line] of input as AsyncIterable<Line>) {
    const r = parseLine(line);
    if (!r) continue;
    if (r.type === "user") {
      if (r.text !== null) prompts.push({ file, ts: r.ts, text: r.text });
      for (const isError of r.results) results.push({ file, ts: r.ts, isError });
    } else {
      let m = msgs.get(r.id);
      if (!m) msgs.set(r.id, (m = { file, ts: r.ts, model: r.model, usage: r.usage, tools: new Map(), blocks: new Map() }));
      for (const [id, name] of r.tools) m.tools.set(id, name);
      for (const t of r.texts) m.blocks.set(`${t.length}:${t.slice(0, 64)}`, (t.match(/죄송|미안/g) ?? []).length);
    }
  }
  if (prompts.length === 0) return null; // ERR-CLI-002

  // 대상일 = 마지막 활동 경계일 (BR-011)
  const dayOf = (ts: number) => boundaryDay(ts, tz);
  let latest = 0;
  for (const p of prompts) if (p.ts > latest) latest = p.ts;
  const day = dayOf(latest);
  const dayPrompts = prompts.filter((p) => dayOf(p.ts) === day);
  const dayMsgs = [...msgs.values()].filter((m) => dayOf(m.ts) === day);

  const tokens = { in: 0, out: 0 };
  const models: Record<string, number> = {};
  const toolCount = new Map<string, number>();
  for (const m of dayMsgs) {
    tokens.in += m.usage.in; tokens.out += m.usage.out;
    if (m.model && !m.model.startsWith("<")) models[m.model] = (models[m.model] ?? 0) + 1; // `<synthetic>` 제외
    for (const name of m.tools.values()) toolCount.set(name, (toolCount.get(name) ?? 0) + 1);
  }
  const top = (m: Map<string, number>, n: number): [string, number][] => [...m].sort((a, b) => b[1] - a[1]).slice(0, n);

  // 7일 컨텍스트: 대상일 포함 최근 7 경계일 (오래된→최근)
  const days = Array.from({ length: 7 }, (_, i) => shiftDay(day, i - 6));
  const idx = new Map(days.map((d, i) => [d, i]));
  const week = { days, prompts: Array(7).fill(0) as number[], tokens: Array(7).fill(0) as number[], heatmap: Array.from({ length: 7 }, () => Array(24).fill(0) as number[]) };
  for (const p of prompts) {
    const i = idx.get(dayOf(p.ts));
    if (i === undefined) continue;
    week.prompts[i]!++;
    week.heatmap[weekday(days[i]!)]![localHour(p.ts, tz)]!++;
  }
  for (const m of msgs.values()) {
    const i = idx.get(dayOf(m.ts));
    if (i !== undefined) week.tokens[i]! += m.usage.in + m.usage.out;
  }

  // 24h 타임라인·새벽 비율 (로컬 시 기준)
  const hourly = { prompts: Array(24).fill(0) as number[], tokens: Array(24).fill(0) as number[] };
  let night = 0;
  for (const p of dayPrompts) {
    const h = localHour(p.ts, tz);
    hourly.prompts[h]++;
    if (h < 5) night++;
  }
  for (const m of dayMsgs) hourly.tokens[localHour(m.ts, tz)] += m.usage.in + m.usage.out;

  // 최장 연속 에러: 세션(파일)별 시간순, 세션 간 최댓값
  let maxErrorStreak = 0;
  const byFile = new Map<string, ToolResult[]>();
  for (const r of results) if (dayOf(r.ts) === day) (byFile.get(r.file) ?? byFile.set(r.file, []).get(r.file)!).push(r);
  for (const list of byFile.values()) {
    let streak = 0;
    for (const r of list.sort((a, b) => a.ts - b.ts)) {
      streak = r.isError ? streak + 1 : 0;
      if (streak > maxErrorStreak) maxErrorStreak = streak;
    }
  }

  // 재미 지표: 사과·재시도 어휘·프롬프트 스타일 (정규식·임계값은 Day 7 조정 가능)
  let apologies = 0;
  for (const m of dayMsgs) for (const n of m.blocks.values()) apologies += n;
  let retryScore = 0, lenSum = 0, oneLiners = 0;
  const lenBuckets = [0, 0, 0, 0, 0];
  for (const p of dayPrompts) {
    retryScore += (p.text.match(/다시|아니|왜/g) ?? []).length;
    const len = p.text.length;
    lenSum += len;
    if (!p.text.includes("\n")) oneLiners++;
    lenBuckets[len < 20 ? 0 : len < 50 ? 1 : len < 100 ? 2 : len < 200 ? 3 : 4]!++;
  }

  // 활동 시간: 인접 프롬프트 간격 30분 이하 구간만 합산
  const sorted = dayPrompts.map((p) => p.ts).sort((a, b) => a - b);
  let activeMs = 0;
  for (let i = 1; i < sorted.length; i++) {
    const gap = sorted[i]! - sorted[i - 1]!;
    if (gap <= 30 * 60_000) activeMs += gap;
  }

  return {
    v: 1,
    generatedAt: now.toISOString(),
    day,
    inProgress: dayOf(now.getTime()) === day,
    stats: {
      prompts: dayPrompts.length,
      sessions: new Set(dayPrompts.map((p) => p.file)).size,
      tokens,
      activeMinutes: Math.round(activeMs / 60_000),
      models,
      tools: top(toolCount, 10),
      hourly,
    },
    week,
    fun: {
      nightRatio: night / dayPrompts.length,
      apologies,
      maxErrorStreak,
      retryScore,
      promptStyle: { avgLen: Math.round(lenSum / dayPrompts.length), oneLinerRatio: oneLiners / dayPrompts.length, lenBuckets },
    },
    highlights: highlights(dayPrompts.map((p) => p.text)),
  };
}
