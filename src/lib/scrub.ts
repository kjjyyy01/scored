// BR-004 URL 위생 — 해시(하이라이트 원문)와 진입 출처 쿼리를 떼는 곳.
// 의존 0으로 둔다: 주소창 정리(브라우저)·오류 수집(엣지 런타임)이 같이 쓰므로 무거운 걸 끌면 안 된다

// 주소창용 — 절대 URL 전제 (호출부가 location.href를 준다)
export function strippedUrl(href: string): string {
  const u = new URL(href);
  u.hash = "";
  u.searchParams.delete("from");
  return u.toString().replace(/\?$/, "");
}

// 외부(Sentry) 전송용 — 상대 경로·불량 입력이 섞여 들어오므로 던지지 않는다
export function scrubUrl(url: string): string {
  try {
    return strippedUrl(url);
  } catch {
    return url.split("#")[0]!;
  }
}
