@AGENTS.md

# 규칙

- 매 세션 시작 시 docs/PLAN.md의 현재 Day 섹션을 확인할 것
- 스택: Next.js·Tailwind·Vercel (웹 기본값) — (Day 1 확정 후 기입)
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
