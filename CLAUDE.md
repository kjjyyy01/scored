@AGENTS.md

# 규칙

- 매 세션 시작 시 docs/PLAN.md의 현재 Day 섹션을 확인할 것 — **해당 구간 지정 스킬은 필수 사용** (PLAN 운용 원칙 4 — 수정·재검토 작업 포함)
- 서비스: **바이브 성적표** — AI 코딩 세션 데이터를 브라우저 로컬 분석해 재미 성적표 생성 (비로그인·무업로드)
- 스택: Next.js·Tailwind·shadcn/ui·Vercel — Day 1 웹 확정 (앱·위젯은 판정 통과 후 후속)
- Git: main 자동 배포, 매일 배포
- 성능 예산: LCP 2.5초
- 보안: 시크릿 커밋 금지, 사용자 입력은 서버 측 검증
- 마크업 위생: 서버 렌더링 HTML·시맨틱 마크업·메타데이터 — JS 없이도 콘텐츠가 보여야 함
- 재미 장치는 v1에 1개. 두 번째 재미 아이디어는 구현 금지, backlog행

## Agent skills

### Issue tracker

GitHub Issues (`gh` CLI). See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context: 루트 `CONTEXT.md` + `docs/adr/`. See `docs/agents/domain.md`.
