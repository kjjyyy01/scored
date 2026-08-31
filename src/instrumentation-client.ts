// 클라이언트 오류 수집 — 하이드레이션 전 실행 (Next 16 instrumentation-client 규약)
// DSN이 없으면 아무것도 하지 않는다: 키 미설정 환경에서 무동작 (GA4와 같은 게이팅)
import * as Sentry from "@sentry/nextjs";
import { scrubUrl } from "@/lib/scrub.ts";

const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (DSN) {
  Sentry.init({
    dsn: DSN,
    // 성능 트레이싱·세션 리플레이 모두 0 — 리플레이는 성적표 화면을 통째로 녹화한다 (BR-004 위반)
    tracesSampleRate: 0,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    sendDefaultPii: false,
    // 이벤트의 URL에서 해시·?from 제거 — 해시에 하이라이트 원문이 실릴 수 있다 (BR-004)
    beforeSend(event) {
      if (event.request?.url) event.request.url = scrubUrl(event.request.url);
      return event;
    },
    // 내비게이션·fetch 브레드크럼도 URL을 싣는다 — 같은 이유로 전부 훑는다
    beforeBreadcrumb(crumb) {
      const d = crumb.data;
      if (d) for (const k of ["url", "to", "from"]) {
        if (typeof d[k] === "string") d[k] = scrubUrl(d[k]);
      }
      return crumb;
    },
  });
}

// App Router 전환을 오류 컨텍스트에 남긴다 (Next 16 규약 — Sentry가 짝 함수를 제공)
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
