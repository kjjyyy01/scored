// 시간 유틸 — 모든 버킷은 주어진 IANA 타임존 기준 (기본: 실행 머신 로컬)
const DAY_START_HOUR = 5; // 하루 경계 05:00 (BR-011)
const H = 3600_000;
const fmts = new Map<string, Intl.DateTimeFormat>();

function fmt(tz: string): Intl.DateTimeFormat {
  let f = fmts.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit" });
    fmts.set(tz, f);
  }
  return f;
}

// ts의 로컬 날짜(YYYY-MM-DD)와 시(0~23)
function localParts(ts: number, tz: string): { date: string; hour: number } {
  const p: Record<string, string> = {};
  for (const x of fmt(tz).formatToParts(ts)) p[x.type] = x.value;
  return { date: `${p.year}-${p.month}-${p.day}`, hour: Number(p.hour) % 24 };
}

// 05:00 경계일 — 5시간 앞당긴 시각의 로컬 날짜 (DST 전환일 1h 오차 허용)
export const boundaryDay = (ts: number, tz: string): string => localParts(ts - DAY_START_HOUR * H, tz).date;

// 로컬 시 (0~23)
export const localHour = (ts: number, tz: string): number => localParts(ts, tz).hour;

// YYYY-MM-DD ± n일 (달력 산술은 UTC로 — 타임존 무관)
export function shiftDay(day: string, n: number): string {
  const [y, m, d] = day.split("-").map(Number) as [number, number, number];
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

// 요일 0=일
export function weekday(day: string): number {
  const [y, m, d] = day.split("-").map(Number) as [number, number, number];
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export const systemTz = (): string => Intl.DateTimeFormat().resolvedOptions().timeZone;
