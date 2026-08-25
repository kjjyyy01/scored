// SCR-004 대시보드 계산 — TC-DASH-001-03 이번 주 평균 대비
// week 배열은 오래된→최근(05 규약), 마지막 원소가 대상일

export function weekDelta(values: number[]): number | null {
  if (values.length < 2) return null;
  const others = values.slice(0, -1);
  const avg = others.reduce((a, b) => a + b, 0) / others.length;
  if (avg === 0) return null;
  return Math.round(((values[values.length - 1] - avg) / avg) * 100);
}
