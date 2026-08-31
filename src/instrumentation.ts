// 서버·엣지 오류 수집 (Next 16 instrumentation 규약). DSN 없으면 무동작 — 클라이언트와 동일 게이팅
import * as Sentry from "@sentry/nextjs";
import { scrubUrl } from "@/lib/scrub.ts";

const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

export function register() {
  if (!DSN) return;
  // node·edge 런타임 모두 이 파일이 실행된다 (/api/og는 엣지 후보)
  Sentry.init({
    dsn: DSN,
    tracesSampleRate: 0,
    sendDefaultPii: false,
    // 서버 이벤트도 URL을 싣는다 — /report 해시가 리퍼러로 새는 경로까지 막는다 (BR-004)
    beforeSend(event) {
      if (event.request?.url) event.request.url = scrubUrl(event.request.url);
      return event;
    },
  });
}

// 서버 렌더·라우트 핸들러 예외를 Sentry로 (Next 16이 잡아 넘겨준다)
export const onRequestError = Sentry.captureRequestError;
