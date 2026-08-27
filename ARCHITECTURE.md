# ARCHITECTURE.md

- 플랫폼: **웹(Next.js 16 App Router, Vercel)** + **npm CLI `scored`** — Day 1 웹 확정, Day 2 CLI 진입 확정
- 데이터 흐름: `npx @jong-yeon/scored`(사용자 머신) → `~/.claude/projects/**/*.jsonl` 스트리밍 집계 → 05 페이로드 → `deflate-raw`+`base64url` → `scored.kr/report?from=cli#<data>` (해시 = 서버 미전송) → 브라우저가 디코딩·렌더. 대화 원문은 `~/.scored/{day}.html` 로컬 파일로만 (Day 5)
- 데이터 저장: **없음** — DB·인증·서버 상태 無 (비로그인 v1). localStorage 미사용. 예외: 동적 OG `/api/og` (무DB 엣지 함수, 요약 스탯 쿼리만)
- 외부 API/AI: **없음** (정적 분석). GA4만 (Day 15)
- 디렉터리 구조 (2026-08-18):
  - `src/app/` — Next 라우트 (`/`, `/report`, `/how`, `/api/og`), `globals.css`(shadcn 토큰·다크=시스템 추종), `layout.tsx`(Pretendard·Geist Mono)
  - `src/components/ui/` — shadcn/ui (필요 컴포넌트만 add) · `src/lib/utils.ts`
  - `cli/` — 독립 npm 패키지 `scored` (의존성 0, `node:test`, TS erasable → `tsc` → `dist/`)
    - `src/types.ts` 05 페이로드 타입(웹과 공유) · `analyze.ts` 집계(§2·§3·§4)+세션 판정 · `report.ts` 로컬 대화 리포트(REQ-CLI-003) · `time.ts` 05:00 경계·타임존 · `files.ts` JSONL 스트리밍 · `encode.ts` 06 인코딩·URL · `open.ts` 브라우저 · `copy.ts` CPY 문구 · `main.ts` 흐름(DI) · `index.ts` bin
    - 세션 = 파일이 아니다: 재개 시 `.jsonl`이 통째 복제되므로 프롬프트 `uuid` 중복 제거 + 부분집합 파일 제외(`liveSessions`) — `analyze.ts`가 SSOT, `report.ts`가 재사용
    - 로그를 두 번 읽는다(집계 1회 + 리포트 1회, 실측 각 2.4s). 대상일이 집계 후에야 정해지므로 — 느려지면 대상일 파일만 추려 2회차에 전달
    - `test/*.test.ts` — CLI-001 §9 TC 1:1
  - `docs/` — PLAN·MVP·prd/·history·grill-log
