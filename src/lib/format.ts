// 공용 표시 포맷 — 카드·대시보드·OG가 같은 표기를 쓴다 (중복 3회 룰로 추출)

export const num = (n: number) => n.toLocaleString("ko-KR");

// 활동 시간 312분 → "5시간 12분"
export function duration(min: number): string {
  const h = Math.floor(min / 60);
  return h ? `${h}시간${min % 60 ? ` ${min % 60}분` : ""}` : `${min}분`;
}
