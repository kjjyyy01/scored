// 15 분석·추적 — gtag 얇은 래퍼. 측정 ID가 없으면 조용히 무동작 (Day 6: 코드만, ID는 사용자)
// 파라미터 정책: 15 표의 키만. 지표 값·유형명·등급·하이라이트·파일 경로 전송 금지 (14 §5)
type Params = Record<string, string | boolean>;

export function track(event: string, params?: Params) {
  const w = window as unknown as { gtag?: (...a: unknown[]) => void };
  w.gtag?.("event", event, params);
}
