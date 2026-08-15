# TODO.md

> 일정: Day 0 = 8/11(화) 완료, Day 1 = 8/12(수) → Day 20 = 8/31(월)
> 런칭 실행은 화~목 규칙에 따라 9/1(화) = Day 21 버퍼 하루 사용

## Day 0 — 사전 세팅

- [x] 시작일 역산 (Day 20 = 9/1 화)
- [x] 필수 문서 5종 작성 (CLAUDE.md / DESIGN.md / ARCHITECTURE.md / ANIMATION.md / TODO.md)
- [x] backlog.md 생성
- [x] ecc code-reviewer 에이전트 ~/.claude/agents/ 확인 (기복사됨)
- [x] 플러그인 정리: ecc·omc·superpowers-ecc·pm-*·sentry·playwright·ui-ux-pro-max 전부 disabled 확인
- [x] notion·obsidian 플러그인 disabled (EOD 기록 세션에서만 enable)
- [x] /setup-matt-pocock-skills 실행 (GitHub Issues 트래커, docs/agents/ 생성)
- [x] 도메인: 아이디어 확정(Day 1) 직후 구매하기로 결정
- [x] Next.js 스캐폴드(웹 기본값) + git init + GitHub 리포 생성·push (kjjyyy01/second-project, private)
- [x] Vercel 연결 완료 (홈페이지에서 직접 처리) — main 자동 배포는 다음 push로 확인
- [x] 월 고정비 상한: 4만원/월 (런칭 시 Vercel Pro $20 전환 판단 포함)
- [x] GA4 속성 추가 완료
- [x] Obsidian dev-notes/ + TIL 템플릿 (~/obsidian/resume/dev-notes/)
- [x] Notion "개발 로그" DB 생성 + Day 0 기록 (EOD 세션 때만 notion 플러그인 enable 후 세션 시작)

## Day 1 (8/12 수) — 아이디어 발굴·검증·확정

- [x] 발산·수렴: 문답 브레인스토밍 + 카탈로그 20개 (백지 발산 불가로 방식 변형)
- [x] 검증: 경쟁 3(Widgetable·Pookie·FurTwo)·차별점(무설치 링크·무광고 단일 기능)·불만(광고 6~8개) 확보
- [x] 최종 확정: **바이브 성적표** — `~/.claude` 세션 데이터를 브라우저에 드래그 → 로컬 분석 → 재미 성적표 (개발자 유형·"미안하다" 카운트·최장 삽질·새벽 코딩 지수) + 공유 카드. 무업로드·비로그인
- [x] 산출물 5개: 한국어 / 킬(생성 완료율 20%·공유율 10%, 표본 방문 300) / 축=재미 손맛(성적표 공개 연출) / 유입=공유(카드=유입 엔진, GeekNews·디스콰이엇) / 웹 확정
- [x] 재미 장치 1개: 성적표·유형 공개 연출 (랭킹·수집·연간결산은 backlog)
- [x] 서비스명 확정: 바이브 성적표 → 도메인 vibescore.kr 미등록 확인
- [ ] 도메인 구매 (사용자 — vibescore.kr 결제, **Day 2 종료 후로 이월**)
- [ ] EOD: Notion 기록 세션 (notion 플러그인 별도 세션)

### Day 1 특이사항 (Day 2+ 인계)
- 낮 확정본 2건(살까말까→물줬어?)이 저녁에 뒤집힘 — 최종은 사용자가 자발 발굴한 바이브 성적표. 전 과정 기록은 history.md
- 서비스명·도메인에 "Claude" 사용 금지 (상표 리스크) — 설명문 "Claude Code 지원"은 OK
- Day 2 판정 예고: 백엔드 **불필요 유력**(브라우저 로컬 처리) / 외부 API 불필요(정적 분석) / 콘텐츠 판정 = **유형·문구 풀 제작일 배정 필요** (성적표 유머가 콘텐츠다)
- 리스크: 파일 드래그 마찰(킬 지표 1번으로 측정) / Claude Code 데이터 포맷 변경 가능성 (파서 버전 대응)

## Day 2 (8/13 목) — MVP 기획서

- [x] SCR 5~7개 초안 v2 (SCR 6개 — 성적표+대시보드+공유 카드, 재미 장치 1개 포함) + 범위 판정 3종 (백엔드 無 / 콘텐츠=Day 7 배정 / 외부 API 無 / CLI 개발 1일 배정) → docs/MVP.md
- [x] JSONL 파싱 스펙: 실데이터 263개 파일 구조 분석 → 성적표·대시보드 지표 확정 → docs/MVP.md
- [x] 진입 방식 확정: `npx vibe-scorecard` CLI → URL 해시로 결과 전달 (사용자 결정, 드래그&드롭은 발동 조건부 backlog)
- [x] /grill-me 스코프 방어 3라운드(Q1~Q11) 통과 → 기획서 v3 확정 (원문: docs/grill-log.md)
- [x] grill 반영: 유형 6종 / 발췌 웹 승인 / 킬 지표 데스크톱 모수(도달률 20%·공유 10%·표본 150) / 대시보드 컷 탈출구 / 명령어 나에게 보내기
- [x] 레포 public 전환 (사용자) + git 이력 시크릿 스캔 통과 확인 (Claude)
- [x] npm 패키지명 확인: `vibe-scorecard`·`vibescore` 둘 다 미등록 — 첫 publish로 선점 (계정만 준비)
- [x] ~~도메인 vibescore.kr 결제~~ → Day 3 `vibe-scorecard.kr` → 2026-08-15 **`scored.kr`로 최종 변경·구매 완료** (아래 참조)
- [ ] EOD: Notion 기록 세션 (notion 플러그인 별도 세션)

## Day 3 (8/14 금) — PRD + GA4 이벤트 스펙

- [x] PRD 생성 (make-prd 규격, docs/prd/ 20문서): SSOT 14개 + 화면 문서 6개(SCR-001~006, 16섹션·AC·TC 포함)
- [x] GA4 이벤트 스펙 확정안: 커스텀 EVT 9종 + 자동 수집 갈음 4종(재방문 식별 포함) + 킬 크라이테리아↔이벤트 계산식 매핑 → docs/prd/15_분석및추적.md
- [x] 핵심 설계 결정 기록: 유형·등급 판정은 웹(BR-001, CLI 재배포 없이 문구 수정), 발췌 승인 흐름(BR-004), OG 쿼리 범위(BR-006)
- [x] 정합성 검사 통과 (예외 1건: 화면↔API 매핑 — 무백엔드라 해당 없음 처리)
- [ ] **사용자 승인 → 화면 문서 status Draft→Approved 전환** (Approved만 구현 대상)
- [x] 도메인 이름 결정: `vibe-scorecard.kr`(npm·레포명 통일안) → 레포명 `scored` 변경에 따라 **`scored.kr`로 최종 확정** 2026-08-15
- [x] **도메인 scored.kr 결제 (사용자)** — 2026-08-15 완료. 잔여: Vercel 프로젝트 연결 + DNS 설정
- [x] **npm 패키지명 `scored` 확정** — 2026-08-15 사용자 결정. `npx scored` — 도메인·레포와 통일 (CPY·ERR·19·04·CLI-001·MVP 반영). 루트 package.json은 `scored-web`(미발행)
- [ ] GA4 측정 ID 발급 확인 (사용자 — OQ-005, Day 15 전이면 됨)
- [ ] EOD: Notion 기록 세션 (notion 플러그인 별도 세션)

### Day 3 → Day 4 인계
- 미해결(OQ) 5건: 유형 6종·문구 풀(Day 7) / 등급 체계(Day 7) / 페이로드 실측 크기(Day 4~5) / GA4 ID / P0 콘텐츠(/how 본문·샘플 성적표, Day 7 — OQ-006). 도메인은 완료
- CLI(F-007) 명세 `docs/prd/CLI-001_분석기.md` 신설 — Day 4 첫 작업의 입력 계약(필터·중복 제거·타임존·Windows 브라우저 오픈)
- Day 4 첫 작업 권장: CLI(F-007) 1일 배정분 — 페이로드 스키마(05)가 CLI·웹 공용 계약이므로 먼저 고정
- PRD 피드백 반영(2026-08-15): ① 00에 v1/v1.x/v2 버전 규약 ② 라우트 `/r`→`/report` ③ shadcn/ui 채택 — Day 4 첫 세팅 순서: `npx shadcn@latest init`(base **stone**) → Pretendard `next/font/local` → `--primary` 실물 카드 위에서 30분 내 확정해 DESIGN.md 기입 (토큰·다크모드 결정은 DESIGN.md 2026-08-15 기입분)
