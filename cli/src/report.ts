// REQ-CLI-003 로컬 대화 리포트 — ~/.scored/{day}.html (원문은 이 파일에만, 14 §2)
import { readdir, unlink, writeFile, mkdir, lstat } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { parseLine, liveSessions, type Input } from "./analyze.ts";
import { boundaryDay, shiftDay } from "./time.ts";

export type Turn = { role: "user" | "assistant"; ts: number; text: string; tools: string[] };
export type Session = { file: string; project: string; ts: number; turns: Turn[]; prompts: number };

const DATED_HTML = /^\d{4}-\d{2}-\d{2}\.html$/; // 삭제 대상 판별 — 이 패턴 밖은 절대 건드리지 않는다

// 프로젝트명: 경로 인코딩된 디렉터리명(-Users-me-projects-scored)의 마지막 조각
const projectOf = (file: string): string => basename(dirname(file)).split("-").filter(Boolean).pop() ?? "?";

const hhmm = (ts: number, tz: string): string =>
  new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(ts);

// 대상일 대화를 파일별로 모으고, 재개 복제본 파일을 제외한다 (CLI-001 §2 세션 정의)
// ponytail: analyze()와 별개로 로그를 한 번 더 읽는다. 실측 2.5s → 5s. 느려지면 대상일 파일만 추려 전달
export async function collectSessions(input: Input, day: string, tz: string): Promise<Session[]> {
  const turns = new Map<string, Turn[]>();
  const promptIds = new Map<string, Set<string>>();
  const seen = new Set<string>();

  for await (const [file, line] of input as AsyncIterable<[string, string]>) {
    const r = parseLine(line);
    if (!r || boundaryDay(r.ts, tz) !== day) continue;
    if (r.type === "user") {
      if (r.text === null) continue; // §2 필터 통과분만 — tool_result·메타는 대화가 아니다
      const id = r.uuid ?? `${r.ts}:${r.text}`;
      let ids = promptIds.get(file);
      if (!ids) promptIds.set(file, (ids = new Set()));
      ids.add(id);
      if (seen.has(id)) continue; // 재개 복제 프롬프트
      seen.add(id);
      push(turns, file, { role: "user", ts: r.ts, text: r.text, tools: [] });
    } else {
      if (seen.has(r.id)) continue;
      seen.add(r.id);
      const text = r.texts.join("\n\n");
      const tools = r.tools.map(([, name]) => name);
      if (text || tools.length) push(turns, file, { role: "assistant", ts: r.ts, text, tools });
    }
  }

  const live = liveSessions(promptIds);
  return [...turns]
    .filter(([file]) => live.has(file))
    .map(([file, list]) => {
      list.sort((a, b) => a.ts - b.ts);
      return { file, project: projectOf(file), ts: list[0]!.ts, turns: list, prompts: list.filter((t) => t.role === "user").length };
    })
    .sort((a, b) => a.ts - b.ts);
}

function push(m: Map<string, Turn[]>, file: string, t: Turn): void {
  const list = m.get(file);
  if (list) list.push(t);
  else m.set(file, [t]);
}

// 세션 제목: {프로젝트} · HH:MM · {첫 프롬프트 40자} — 8자 미만이면 프롬프트 수로 폴백
export function sessionTitle(s: Session, tz: string): string {
  const head = `${s.project} · ${hhmm(s.ts, tz)}`;
  const first = s.turns.find((t) => t.role === "user")?.text.replace(/\s+/g, " ").trim() ?? "";
  return first.length < 8 ? `${head} · 프롬프트 ${s.prompts}개` : `${head} · ${first.slice(0, 40)}`;
}

const esc = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const CSS = `:root{color-scheme:light dark}
body{max-width:46rem;margin:0 auto;padding:2rem 1rem;font:16px/1.7 Pretendard,-apple-system,"Apple SD Gothic Neo","Malgun Gothic",sans-serif;background:#fafaf9;color:#1c1917}
h1{font-size:1.4rem;margin:0 0 .3rem}.sub{color:#78716c;font-size:.85rem;margin:0 0 2rem}
h2{font-size:.95rem;font-weight:600;margin:2.5rem 0 .8rem;padding-bottom:.4rem;border-bottom:1px solid #e7e5e4;color:#57534e}
.t{margin:1.1rem 0}.who{font-size:.75rem;font-weight:600;color:#a8a29e;margin-bottom:.2rem}
.me .who{color:#c2410c}.me .body{background:#fff7ed;border-left:2px solid #fdba74}
.body{white-space:pre-wrap;word-break:break-word;background:#fff;border-left:2px solid #e7e5e4;padding:.7rem .9rem;border-radius:0 4px 4px 0}
.tool{font-size:.8rem;color:#a8a29e;margin:.3rem 0 0 .9rem}
@media(prefers-color-scheme:dark){body{background:#1c1917;color:#e7e5e4}h2{border-color:#44403c;color:#a8a29e}
.body{background:#292524;border-color:#44403c}.me .body{background:#2c1d13;border-color:#9a3412}}`;

export function renderReport(sessions: Session[], day: string, tz: string): string {
  const total = sessions.reduce((n, s) => n + s.prompts, 0);
  const body = sessions.map((s) => {
    const turns = s.turns.map((t) => {
      const tools = t.tools.map((name) => `<div class="tool">▸ ${esc(name)}</div>`).join("");
      const text = t.text ? `<div class="body">${esc(t.text)}</div>` : "";
      return `<div class="t${t.role === "user" ? " me" : ""}"><div class="who">${t.role === "user" ? "나" : "Claude"} · ${hhmm(t.ts, tz)}</div>${text}${tools}</div>`;
    }).join("\n");
    return `<h2>${esc(sessionTitle(s, tz))}</h2>\n${turns}`;
  }).join("\n");

  return `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>${day} 대화 기록 — scored</title><style>${CSS}</style></head><body>
<h1>${day} 대화 기록</h1>
<p class="sub">세션 ${sessions.length}개 · 프롬프트 ${total}개 · 이 파일은 내 컴퓨터에만 있습니다 (최근 7일치만 보관)</p>
${body}
</body></html>`;
}

// 최근 7 경계일 밖 리포트 삭제 — DATED_HTML 정확 매치 + 일반 파일만 (REQ-CLI-003 AC-5)
export async function pruneOld(dir: string, day: string): Promise<void> {
  const keep = new Set(Array.from({ length: 7 }, (_, i) => `${shiftDay(day, i - 6)}.html`));
  let names: string[];
  try { names = await readdir(dir); } catch { return; }
  for (const name of names) {
    if (!DATED_HTML.test(name) || keep.has(name)) continue;
    try {
      if (!(await lstat(join(dir, name))).isFile()) continue; // 디렉터리·심볼릭 링크는 제외
      await unlink(join(dir, name));
    } catch { /* 삭제 실패는 무시 — 리포트 생성이 우선 */ }
  }
}

export async function writeReport(dir: string, day: string, html: string): Promise<string> {
  await mkdir(dir, { recursive: true, mode: 0o700 });
  const path = join(dir, `${day}.html`);
  await writeFile(path, html, { encoding: "utf8", mode: 0o600 });
  return path;
}
