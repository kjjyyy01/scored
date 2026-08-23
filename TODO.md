# TODO.md

> 일정 (2026-08-22 재조정 — 8/19 서밋 공백 + **8/21~8/22 작업 공백 2일**): Day 0 = 8/11(화), Day 1~2 = 8/12~13, Day 3 = 8/14~8/16(일), Day 4 = 8/18(화), Day 5 = 8/20(목) → **Day N≥6 = 8/17+N: Day 6 = 8/23(일)**, Day 9 = 8/26(수), Day 14 = 8/31(월), Day 19 = 9/5(토), 9/6~9/7 버퍼 잔량, **Day 20 런칭 = 9/8(화)**, Day 21 = 9/9(수) 버퍼, 판정일 9/22(화)
> 조정 2회: ① Day 3 PRD 범위 확대 +2일 ② Day 4 착수 1일 지연 +1일 — 둘 다 캘린더 확장(실작업일 21 불변, 버퍼 보존 — PLAN 상단 조정 이력)

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

## Day 3 (8/14 금 ~ 8/16 일) — PRD + GA4 이벤트 스펙

- [x] PRD 생성 (make-prd 규격, docs/prd/ 20문서): SSOT 14개 + 화면 문서 6개(SCR-001~006, 16섹션·AC·TC 포함)
- [x] GA4 이벤트 스펙 확정안: 커스텀 EVT 9종 + 자동 수집 갈음 4종(재방문 식별 포함) + 킬 크라이테리아↔이벤트 계산식 매핑 → docs/prd/15_분석및추적.md
- [x] 핵심 설계 결정 기록: 유형·등급 판정은 웹(BR-001, CLI 재배포 없이 문구 수정), 발췌 승인 흐름(BR-004), OG 쿼리 범위(BR-006)
- [x] 정합성 검사 통과 (예외 1건: 화면↔API 매핑 — 무백엔드라 해당 없음 처리)
- [x] **사용자 승인 → 화면 문서 status Draft→Approved 전환** — **2026-08-17 승인** (SCR-001~006 + CLI-001, v1.1.0). PRD 전체 피드백 = 8항 검토 + grill 3라운드로 갈음
- [x] 도메인 이름 결정: `vibe-scorecard.kr`(npm·레포명 통일안) → 레포명 `scored` 변경에 따라 **`scored.kr`로 최종 확정** 2026-08-15
- [x] **도메인 scored.kr 결제 (사용자)** — 2026-08-15 완료. 잔여: Vercel 프로젝트 연결 + DNS 설정
- [x] **npm 패키지명 `scored` 확정** — 2026-08-15 사용자 결정. `npx scored` — 도메인·레포와 통일 (CPY·ERR·19·04·CLI-001·MVP 반영). 루트 package.json은 `scored-web`(미발행)
- [ ] GA4 측정 ID 발급 확인 (사용자 — OQ-005, Day 15 전이면 됨)
- [ ] EOD: Notion·Obsidian 기록 세션 (notion 플러그인 별도 세션) — **2026-08-17 새 세션에서 진행** (Day 3 내용은 docs/history.md 2026-08-14~17 항목 참조)

### Day 3 → Day 4 인계
- 미해결(OQ) 5건: 유형 6종·문구 풀(Day 7) / 등급 체계(Day 7) / 페이로드 실측 크기(Day 4~5) / GA4 ID / P0 콘텐츠(/how 본문·샘플 성적표, Day 7 — OQ-006). 도메인은 완료
- CLI(F-007) 명세 `docs/prd/CLI-001_분석기.md` 신설 — Day 4 첫 작업의 입력 계약(필터·중복 제거·타임존·Windows 브라우저 오픈)
- **2026-08-16~17 grill 확정 (PRD 검토 8항)**: 성적표 = **하루 단위**(마지막 활동일, 경계 05:00) **스탯 카드 + 등급 뱃지**(Readme Stats 은유) + 7일 컨텍스트 / `/report` 한 스크롤 페이지(카드→대시보드 섹션) / 대화 원문은 CLI가 **로컬 HTML 리포트**(`~/.scored/{day}.html`)로 두 번째 탭 오픈(URL·서버 무관) / 등급 = 프롬프트·토큰·활동 시간 3지표 6단계(BR-009), 오늘의 유형 6종+폴백(BR-010) / 연출 = 카운트업→등급 릴→카드 / 재방문 = 문구+alias 안내. **CLI 배정 1일 → 1.5일**(리포트 +0.5). 05·CLI-001·SCR 전부 갱신됨 — Day 4 착수 전 CLI-001·05 재독 필수
- Day 4 첫 작업 권장: CLI(F-007) 1일 배정분 — 페이로드 스키마(05)가 CLI·웹 공용 계약이므로 먼저 고정
- PRD 피드백 반영(2026-08-15): ① 00에 v1/v1.x/v2 버전 규약 ② 라우트 `/r`→`/report` ③ shadcn/ui 채택 — Day 4 첫 세팅 순서: `npx shadcn@latest init`(base **stone**) → Pretendard `next/font/local` → `--primary` 실물 카드 위에서 30분 내 확정해 DESIGN.md 기입 (토큰·다크모드 결정은 DESIGN.md 2026-08-15 기입분)

## Day 4 (**8/18 화** — 8/17 계획에서 1일 지연 → **캘린더 재매핑 확정** 2026-08-19 사용자 결정: Day N≥4 = 8/14+N, 런칭 9/3(목), 버퍼 보존) — 세팅 + CLI(F-007) 1.5일분 착수

- [x] shadcn/ui init: `base-nova` 스타일 · baseColor **stone** · theme orange (Base UI, Tailwind v4·React 19 확인) → `components.json`, `src/lib/utils.ts`
- [x] Pretendard `next/font/local`(pretendard npm, 가변 1파일, swap) + Geist Mono 유지 · `lang="ko"` · 다크모드 → `prefers-color-scheme` 시스템 추종(클래스 방식 제거)
- [ ] `--primary` 확정 (사용자, 실물 카드 첫 렌더일) — 임시: shadcn orange `oklch(0.553 0.195 38.402)`. 후보 형광 `oklch(0.70 0.19 45)`는 흰 글자 대비 ≈2.7:1로 버튼 배경 부적합 → DESIGN.md 참조
- [x] CLI `cli/` 스캐폴드: `node:test`(무의존성) · TS erasable(무빌드 테스트) · `tsc` publish 빌드 — 루트 tsconfig에서 `cli` 제외
- [x] CLI 집계 코어 `/tdd` — TC-CLI-001-01~06·11~14 + §3 fun·models 테스트 (20 tests pass) — 실로그 300파일 2.5s
- [x] 06 인코딩·URL·크기 상한 재인코딩 — TC-CLI-001-07(DecompressionStream 라운드트립)·08 + **OQ-004 실측 1,104자 → 8,000자 상한 확정** (05·21 기입)
- [x] `main`: 브라우저 오픈(darwin/linux/win32 PowerShell)·ERR-CLI-001~003·CPY-CLI 문구·`--help/--version` — TC-CLI-001-09·10 + E2E(`node cli/dist/index.js` → 탭 오픈 확인)
- [x] **make-prd 일괄 반영** → Day 5 완료 (아래)
- [x] (Day 5) 로컬 대화 리포트 HTML REQ-CLI-003 → Day 5 완료 (아래)
- [x] EOD: ARCHITECTURE.md 디렉터리 구조 · history.md · `next build` 통과 · 커밋·push(매일 배포) — **기록 세션은 8/20 밤 Day 5와 합산 처리**(Obsidian TIL 1건 `bin 진입점`, Notion TS-01·02)

## Day 5 (**8/20 목**) — CLI 잔여 0.5일(REQ-CLI-003) + 집계 결함 수정

- [x] `npm login` (사용자) — `jong-yeon`으로 로그인 완료
- [x] **npm 라이선스 정책 확정 (사용자)**: CLI만 MIT, 웹은 현행 All Rights Reserved → `cli/LICENSE` 신설 + `cli/package.json` `"license": "MIT"`. `npm pack --dry-run` 20파일 9.0kB, LICENSE 포함 확인
- [x] **[결함] 프롬프트·세션 수 부풀림 발견·수정** — 세션 재개 시 `.jsonl`이 통째 복제됨. 실측 8/19: 프롬프트 28→15(46% 부풀림), 세션 파일 4개=실제 대화 2개. 미수정 시 등급 BR-009 인플레. `uuid` 중복 제거 + 부분집합 파일 제외(`liveSessions`) — TC-CLI-001-15·15b
- [x] **OQ-007 확정 (사용자 결정)**: ① 도구 결과 원문 미포함(이름만 접힘) ② 세션 제목 `{프로젝트} · HH:MM · 첫 프롬프트 40자`, 8자 미만 시 프롬프트 수 폴백 ③ 보관 = 최근 7일 롤링 자동 삭제
- [x] **make-prd 일괄 반영 6건** — CLI-001 v1.2.0(§2 중복 제거 2행·세션 정의·§3 4행·REQ-CLI-003 AC-5+렌더 규칙·엣지 2건·TC 6건) · 11(CPY-CLI-004 개정·005 신설·HOW-001) · 05(3행) · 14(파기 정책 신설) · 21(OQ-007 종결). 정합성 9항목 통과
- [x] **REQ-CLI-003 구현** `/tdd` — `src/report.ts` 신설(collectSessions·renderReport·pruneOld·writeReport) + main 통합. TC-CLI-003-01·01b·02·03·04·05·06 + writeReport 0600 → **31 tests pass**
- [x] E2E — 실데이터 5세션·23프롬프트, exit 0, 4.8초, URL 1,221자, 리포트 26.7KB/0600, 7일 롤링 삭제 동작·사용자 파일 보존 확인
- [x] **`--primary` 확정 (사용자)** — 딥 그린. 원안 `oklch(0.55 0.15 150)`은 foreground 토큰과 4.27:1로 SC 1.4.3 미달 → 명도 −0.05 조정해 라이트 `oklch(0.5 0.15 150)` 5.22:1 / 다크 `oklch(0.48 0.14 150)` 5.73:1 확정. DESIGN.md 임시 딱지 제거
- [x] **`/report` 화면 착수** — `src/lib/payload.ts`(06 디코딩·BR-002·003·004, 5 tests) + `SCR-003` 스탯 카드 6줄 + SCR-002 진입 로직. 390/768px 실렌더 확인. 유형·등급은 Day 7 자리만
- [x] 브라우저 전용 버그 2건 수정 — 손상 해시 미처리 거부 · StrictMode 이중 실행으로 해시를 두 번 읽어 정상 링크를 ERR-HASH-001로 오판정
- [x] **토큰 지표 개정 (사용자 결정)** — `stats.tokens.in`에서 `cache_read` 제외. 실측상 전체의 91~97%를 차지해 지표가 사실상 cache_read 단일 값이었고, 세션 길이의 함수라 작업량을 못 쟀다. 날짜 편차 153배→6배, 카드 표시 46.5M→1.33M. PRD(CLI-001 §3·05·08 BR-009 전제) + `analyze.ts` + TC-CLI-001-17 반영, 32 tests pass
- [ ] npm publish `scored` — `cli/README.md` ✅ 작성됨. 웹 화면 더 붙은 뒤로 시점 보류 (사용자 합의)
- [x] EOD: history.md · 커밋·push(매일 배포)
- [x] **EOD 기록 세션 (Day 4·5 합산, 2026-08-20 밤)** — Obsidian TIL **신규 6건**(jsonl 재개 복제 / cache_read 지표 / StrictMode 일회성 값 / 헤드리스 최소 뷰포트 / 파일 삭제 안전선 / bin DI) + 기존 `대비비` 노트에 `--primary` 사례 보강. 중복 주제 3건은 의도적 제외
- [ ] **Notion「개발 로그:scored」등록** — 원고 완성됨: 진행 요약 2건 + 트러블슈팅 TS-01~07 (`~/obsidian/resume/dev-notes/_notion-원고-scored-Day4-5.md`). 8/23 EOD 세션에서 MCP OAuth 미승인으로 재이월 — **Day 6 원고(`_notion-원고-scored-Day6.md`)와 묶어 다음 EOD 세션에 등록** (세션 시작 시 Notion 인증 먼저)

## Day 6 (**8/23 일**) — 잔여 화면 구현 (모바일 퍼스트, 애니메이션 금지)

> 브랜치 `feat/day6-screens`. Day 9(8/26) 스코프 컷까지 구현일은 Day 6·8 이틀뿐 (Day 7 = 콘텐츠 고정).
> 목표: 오늘 SCR-001·006 완료, SCR-005 착수. SCR-004는 Day 8 (컷 1순위).

### Claude 담당

- [x] **SCR-001 랜딩** — 기본 템플릿 제거, EL-LAND-001~006 (헤드라인·npx 복사 CTA·샘플 카드·나에게 보내기·서버전송0 배지·GitHub). 모바일 퍼스트, 서버 렌더링
- [x] REQ-LAND-001/002 — 클립보드 복사 + ERR-CLIP-001 폴백, Web Share API + 클립보드 폴백. TC-LAND-001-01·02, TC-LAND-002-01
- [x] **SCR-006 `/how`** — EL-HOW-001~006 전부 서버 렌더링(JS 불요). CPY-COM-001·003, CPY-HOW-001
- [~] **SCR-005 공유 카드** — 네이티브 `<dialog>` 오버레이(바텀시트/중앙 모달)·미리보기·링크 복사·하이라이트 토글(BR-004)·OG 고지 ✅ / **카드 PNG 저장(REQ-SHARE-001)·동적 OG(REQ-SHARE-003)는 Day 8** — 클라이언트 캔버스 렌더러 필요. TC-SHARE-002-01·02 통과
- [x] GA4 gtag 설치 + **EVT 7종 실발화 검증** — EVT-LAND-001·002 / EVT-RES-001·003 / EVT-SHARE-001·003 (측정 ID `NEXT_PUBLIC_GA_ID` 등록됨, 성적 데이터 파라미터 금지 14 §5 준수). 잔여 EVT: RES-002(연출 Day 10~12) · DASH-001(SCR-004 Day 8) · SHARE-002(카드 저장 Day 8)
- [x] 위생: 404·`error.tsx`(ERR-APP-001)·robots.ts·sitemap.ts·정적 OG(`opengraph-image.tsx`, Pretendard 임베드)
- [x] 화면별 검수 루프 — 390/768/1280 스크린샷 → 육안 → DESIGN.md 대조 → 체크
- [x] EOD: history.md · 커밋 · main 머지 · push(매일 배포) — 8/23 21:19 화면 머지 / 21:39 EVT 보강 머지, `scored.kr` 200·gtag 확인
- [x] **EOD 기록 세션 (8/23 밤)** — Obsidian TIL **신규 5건**(네이티브 dialog / 킬 크라이테리아 분자 이벤트 당일 검증 / 자리표시 누출 / color-scheme / satori 제약) + 기존 `프로덕션에 안 보인다` 노트에 Vercel force 빌드 사례 보강. Notion 원고 TS-08~15 완성 — 등록은 인증 후(위 Day 5 항목과 합산)

### 사용자 담당

- [x] **GA4 측정 ID 전달** — `.env.local` + Vercel Production `NEXT_PUBLIC_GA_ID` 등록 완료. 등록 후 빌드가 없어 프로덕션에 gtag 부재 → `vercel --prod --force` 재빌드로 베이크, `scored.kr` gtag·collect 204·내부 트래픽 `tt=internal` 확인(8/23)
- [ ] **iOS Safari 실기기 확인** — 배포 후 랜딩·`/report`·공유 시트 (PLAN 주 2회 규칙, 공유 유입 착지점). **같은 Wi-Fi에서** — 내부 트래픽 필터가 IP 기반이라 셀룰러로 열면 지표가 오염된다
- [ ] 배포 URL 육안 확인 (하루 종료 시)
- [x] 결정: SCR-005 착수까지 진행 ✅ / **SCR-004 대시보드 Day 8 배치 확정**(컷 1순위 유지)
- [ ] (보류 유지) npm publish `scored` 시점

### Day 6 → Day 7 인계
- **Day 7(8/24 월) = 콘텐츠 고정일** (PLAN: 개발로 전용 금지) — OQ-001 유형 6종 이름·문구 풀·불용어·임계 미세조정(BR-010) / OQ-002 등급 임계값 표(BR-009, **내 30일 로그 백분위 초안** → 08 §계산 규칙 기입) / OQ-006 `/how` 본문·랜딩 샘플 성적표 데이터·CLI 문구 톤. 세션 시작 시 30일 로그 백분위를 먼저 산출해 임계 후보를 들고 사용자 문답 시작. 문서 수정은 make-prd 경유(운용 원칙 4)
- 웹 판정 모듈(유형·등급)은 Day 7 값이 확정되는 즉시 StatCard 블록이 켜진다 — TS-09 수정으로 값 없으면 미렌더 상태
- **Day 8(8/25 화)** = SCR-004 대시보드 + REQ-SHARE-001 카드 PNG(클라이언트 캔버스) + REQ-SHARE-003 동적 OG + EVT-DASH-001·SHARE-002 배선. **Day 9(8/26 수) 저녁 스코프 컷 판정**(캘린더 등록됨) — 미완성 시 SCR-004부터 삭제
- 잔여 사용자 항목: iOS Safari 실기기(같은 Wi-Fi) · Notion 등록(인증) · npm publish 시점(보류)
