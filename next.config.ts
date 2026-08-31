import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
};

// 소스맵 업로드용 — org·project·auth token은 전부 환경변수로 (레포에 시크릿 금지).
// 토큰이 없으면 업로드만 건너뛰고 빌드는 통과한다.
// ponytail: tunnelRoute 미사용 — 광고 차단기에 막힌 클라이언트 오류는 유실된다.
// 유실률이 문제가 되면 그때 추가 (프록시 라우트가 "서버 무전송" 서사와 충돌하는 비용도 함께 판단)
export default withSentryConfig(nextConfig, {
  silent: true,
  disableLogger: true,
});

// ⚠️ 랜딩 초기 JS: 196.6 → 262.5 KB gzip (**+65.9 KB, +33%**, 2026-08-31 실측).
// Sentry SDK가 초기 로드 경로에 실린다. `bundleSizeOptimizations`(excludeTracing 등)는
// 청크를 137→138KB로 두어 **Turbopack에서 효과 0**이라 제거했다.
// Day 17 LCP 재측정의 감시 항목 — 예산(2.5초) 초과 시 동적 import로 임계 경로에서 뺀다
// (대가: 하이드레이션 직전 오류 유실. 실제 오류는 /report 렌더·상호작용에서 나므로 수용 가능)
