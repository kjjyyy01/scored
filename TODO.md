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
- [x] **Notion「개발 로그:scored」등록** — 8/23 EOD 세션에서 Day 4·5분 9건(과정요약 2 + TS-01~07) 등록 완료. 원고 백업 `~/obsidian/resume/dev-notes/_notion-원고-scored-Day4-5.md`

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
- [x] **EOD 기록 세션 (8/23 밤)** — Obsidian TIL **신규 5건**(네이티브 dialog / 킬 크라이테리아 분자 이벤트 당일 검증 / 자리표시 누출 / color-scheme / satori 제약) + 기존 `프로덕션에 안 보인다` 노트에 Vercel force 빌드 사례 보강. Notion 9건 등록 완료(과정요약 1 + TS-08~15, Day 4·5분 9건과 같은 세션 — OAuth 승인 후 `/plugin`으로 재연결)

### 사용자 담당

- [x] **GA4 측정 ID 전달** — `.env.local` + Vercel Production `NEXT_PUBLIC_GA_ID` 등록 완료. 등록 후 빌드가 없어 프로덕션에 gtag 부재 → `vercel --prod --force` 재빌드로 베이크, `scored.kr` gtag·collect 204·내부 트래픽 `tt=internal` 확인(8/23)
- [x] **Safari 확인 (맥 Safari 26.5 + 응답형 모드 iPhone 프리셋, 8/23 밤)** — 랜딩 복사·나에게 보내기 / `/how` / `/report` 해시 정리·카드·공유 바텀시트(390px)·링크 복사·뒤로가기 닫힘·데스크톱 중앙 모달·다크모드 체크박스 **전부 정상**. iPhone·Xcode 없어 실기기는 미실시 — 빠진 건 터치·스와이프·iOS 공유 시트 (대체안은 아래 인계)
- [x] 배포 URL 육안 확인 (하루 종료 시) — 위 Safari 확인으로 갈음
- [x] 결정: SCR-005 착수까지 진행 ✅ / **SCR-004 대시보드 Day 8 배치 확정**(컷 1순위 유지)
- [ ] (보류 유지) npm publish `scored` 시점

### Day 6 → Day 7 인계
- **Day 7(8/24 월) = 콘텐츠 고정일** (PLAN: 개발로 전용 금지) — OQ-001 유형 6종 이름·문구 풀·불용어·임계 미세조정(BR-010) / OQ-002 등급 임계값 표(BR-009, **내 30일 로그 백분위 초안** → 08 §계산 규칙 기입) / OQ-006 `/how` 본문·랜딩 샘플 성적표 데이터·CLI 문구 톤. 세션 시작 시 30일 로그 백분위를 먼저 산출해 임계 후보를 들고 사용자 문답 시작. 문서 수정은 make-prd 경유(운용 원칙 4)
- 웹 판정 모듈(유형·등급)은 Day 7 값이 확정되는 즉시 StatCard 블록이 켜진다 — TS-09 수정으로 값 없으면 미렌더 상태
- **Day 8(8/25 화)** = SCR-004 대시보드 + REQ-SHARE-001 카드 PNG(클라이언트 캔버스) + REQ-SHARE-003 동적 OG + EVT-DASH-001·SHARE-002 배선. **Day 9(8/26 수) 저녁 스코프 컷 판정**(캘린더 등록됨) — 미완성 시 SCR-004부터 삭제
- 잔여 사용자 항목: npm publish 시점(보류)
- **실기기 공백 대체안** (iPhone·Xcode 없음 — PLAN "주 2회 실기기/iOS Safari"의 실기기 부분 불이행): ① 주 2회 = 맥 Safari 응답형 모드(iPhone UA, 390px) ② **Day 11 테스터 섭외 시 iPhone 사용자 1명 이상 확보** → Day 13 게릴라 테스트가 실기기 검증을 겸함 ③ Day 17 전 화면 순회 = 지인 iPhone 대여 또는 Day 16 밤 Xcode 시뮬레이터 설치(10GB+). PLAN 규칙 문구 수정은 make-plan 경유 — Day 9 컷 판정 때 함께

## Day 7 (**8/24 월**) — 콘텐츠 고정일 (OQ-001·002·006, 개발 전용 금지)

> 브랜치 `feat/day7-content`. 문서 수정은 make-prd 경유(운용 원칙 4).

### Claude 담당

- [x] **30일 로그 백분위 산출** — 활동일 21/30, `analyze.ts` 동일 정의(cache_read 제외·uuid 중복 제거·05시 경계)로 8지표 p10~max 산출
- [x] **BR-009 등급 임계표 확정** → 08 §계산 규칙 — 3지표 앵커 커브(20~100점 5앵커) + S≥90/A+≥75/A≥60/B+≥45/B≥25/C 경계. 21일 검증 분포 C2·B5·B+2·A7·A+2·S3
- [x] **BR-010 임계 미세조정** — retry 0.3→**0.7** / avgLen 200→**1500** / oneLiner 0.7→**0.9** / marathon 600→**480** (구 임계는 장문이 13/21 독식·폴백 0회·마라톤 30일 중 0회 → 신 임계에서 7유형 전부 등장). 새벽 0.4·에러늪 5 유지
- [x] **유형명 현행 확정 + 유형 코드**(07 `t`: night·swamp·retry·long·one·marathon·balance) + **문구 풀 CPY-TYPE-001~007**(유형당 2개, day 숫자합 % 풀 크기 결정적 선택)
- [x] make-prd 경유 PRD 반영 — 08(계산 규칙 신설)·11(TYPE 섹션)·07(`t` 값)·21(OQ-001·002)·00·SCR-003(§10·§11 엣지 1 구조적 해소)·CLI-001(§3 정규식 유지 확정)
- [x] **불용어 확정** → CLI-001 §4 기입 — 56개 목록(EN 기능어 35 + KO 접속8·지시5·관형8) + 소문자 비교 + 양끝 구두점 트리밍. `다시`·`해줘`·`왜`는 의도적 미포함(재미 어휘). CLI 코드 반영은 Day 8
- [x] **랜딩 샘플 2장 확정** — SCR-001 EL-LAND-003·§16 갱신(md+ 2장/모바일 1장) + `SAMPLE_MARATHON`(마라톤 러너·A 72점) 데이터 채움(tsc 클린). 2장 레이아웃 구현은 Day 8
- [x] EOD: history.md · 커밋 · main 머지 · push — 8/24 밤 머지·배포 완료 (`ddd7e9b`)
- [x] **EOD 기록 세션 (8/24 밤)** — Obsidian TIL **신규 6건**(임계는 백분위 앵커 / 불용어 없는 1위는 the / 분석은 프로덕션 소스 import / 랜덤 대신 입력 해시 / 엣지는 판정 구조로 / 샘플은 규칙 역산) · **Notion 7건 당일 등록**(과정요약 1 + TS-16~21, 누적 25건). 원고 백업 `_notion-원고-scored-Day7.md`

### 사용자 담당

- [x] 문답 1라운드 — avgLen **C안 1500** / 등급 커브 승인(추후 수정 가능) / 유형명·문구 풀 현행 채택(추후 교체 가능)
- [x] Q5: 샘플 **2장** (모바일 1장) 결정
- [x] Q6: 불용어 제외 승인
- [ ] 게릴라 테스터 3~5명 섭외 시작 (마감 Day 11 = 8/28 금, iPhone 사용자 1명 포함)

### Day 7 → Day 8 인계

- **OQ 전건 해소** (OQ-001·002·006 완료, OQ-002만 Day 13 게릴라 로그 보정 잔여) — 콘텐츠 차단이 풀렸으므로 Day 8은 순수 구현일
- **Day 8(8/25 화) 작업**: ① 웹 판정 모듈(BR-009 등급·BR-010 유형 — 08 §계산 규칙이 명세, BR-008 `/tdd` 필수) → StatCard 유형·등급 블록 켜기 ② 랜딩 2장 레이아웃(md+ 2장/모바일 1장) ③ CLI 불용어·트리밍 반영(CLI-001 §4) ④ SCR-004 대시보드 ⑤ REQ-SHARE-001 카드 PNG ⑥ REQ-SHARE-003 동적 OG + EVT-DASH-001·SHARE-002. **Day 9(8/26 수) 저녁 컷 판정 — 미완성 시 SCR-004부터 삭제**
- 유형 문구 변수 치환({night}·{streak}·{h}/{m} 등)은 11 CPY-TYPE 표 상단 정의 참조, 문구 선택은 day 숫자합 % 풀 크기(08)

## Day 8 (**8/25 화**) — 순수 구현일: 판정 모듈·대시보드·카드 PNG·동적 OG

> 브랜치 `feat/day8-implementation`. 컷 1순위 SCR-004를 마지막 순서로 배치 → 전 항목 완료.

### Claude 담당

- [x] **① 웹 판정 모듈** `/tdd` — `src/lib/judge.ts`: BR-009 등급 커브(앵커 선형 보간)·BR-010 유형(비율 최대·동점 순서·폴백)·CPY-TYPE 문구(day 숫자합 % 풀, 변수 치환) — 25 tests + 샘플 2장 역검증(swamp·B+ 56 / marathon·A 72) → StatCard 유형·등급·문구 블록 점등
- [x] **② 랜딩 2장 레이아웃** — SAMPLE_MARATHON 추가, md+ 2장/모바일 1장(`hidden md:block`) — 390/768/1280 확인
- [x] **③ CLI 불용어** `/tdd` — 56개(EN 35+KO 21)·양끝 구두점 트리밍·소문자 비교, `다시` 등 재미 어휘 잔존 — CLI 33 tests
- [x] **④ 카드 PNG(REQ-SHARE-001)** — 화면 StatCard DOM을 html-to-image 래스터화(값 복제 금지), 모바일 공유시트(`pointer: coarse`)/데스크톱 다운로드 분기, EVT-SHARE-002 발화 확인, 실PNG 육안 확인
- [x] **⑤ 동적 OG(REQ-SHARE-003)** — shareUrl에 BR-006 쿼리(유일 생성 지점, 부족 모드는 쿼리 없음→정적 폴백) + `/api/og`(satori, 검증 실패 시 기본 이미지, s-maxage=86400) + `/report` generateMetadata 재인코딩. 1200×630 렌더 육안 확인
- [x] **⑥ SCR-004 대시보드** — 타임라인(05시 회전)·주간 추이(±% weekDelta `/tdd`)·히트맵·기본 스탯·도구/모델·프롬프트 스타일(lenBuckets·하이라이트)·로컬 리포트 안내(entry=cli만)·맨 위로. 차트 라이브러리 0(SVG/CSS), EVT-DASH-001(IntersectionObserver) 발화 확인
- [x] 검증 — 웹 49·CLI 33 tests / next build·tsc 통과 / 실로그 E2E(밸런스 코더·B 28점) / GA collect 4종 실발화 / 라이트·다크
- [x] EOD: history.md · 커밋 · main 머지 · push(매일 배포)
- [x] **EOD 기록 세션 (8/25 저녁)** — Obsidian TIL **신규 4건**(canShare 기능≠기기 / 합계 0은 위젯 생략 / 카드는 DOM 래스터화 / 카톡 초장문 URL) + 기존 satori 노트 보강(문자열 병합 회피) · **Notion 6건 당일 등록**(과정요약 1 + TS-22~26, 누적 31건). 원고 백업 `_notion-원고-scored-Day8.md`

### 사용자 담당

- [x] **결정: 게릴라 테스터 → 본인 직접 테스트** (2026-08-25) — 실패 조건 9(Day 13 유저 테스트) 관련 스코프 변경이므로 **Day 9 컷 판정 때 make-plan 경유 PLAN 반영 필요**
- [ ] StatCard 유형·등급 첫 렌더 + 배포 URL 육안 확인 (`scored.kr` 머지 후)
- [ ] `npx scored` 실행해 카드 저장·링크 복사 직접 체험 (iPhone Safari 응답형 확인 겸)
- [ ] (보류 유지) npm publish `scored` 시점 — Day 9 컷 판정 후 재논의

### Day 8 → Day 9 인계

- **Day 9(8/26 수) 저녁 = 스코프 컷 판정 (캘린더 등록됨)** — Day 8 전 항목 완료로 컷 대상 없음이 기본값. 판정 시 함께: ① 게릴라 테스터→본인 테스트 전환 PLAN 반영(make-plan) ② 실기기 공백 대체안 PLAN 문구(Day 6 인계 잔여) ③ **이슈 #1 — 카카오톡이 긴 공유 URL(해시 ~1.3KB)을 스크랩하지 않아 미리보기 미표시** (8/25 실사용 확인, 서버 정상 — 대응 선택지는 이슈 참조) → ⚠️ **Day 9에서 원인 정정: 길이가 아니라 `#` 프래그먼트** (아래 Day 9 섹션)
- 잔여 EVT: RES-002(공개 연출)만 — Day 10~12 축 패스에서 연출과 함께
- 동적 OG 프로덕션 검증: 머지 후 `scored.kr` 공유 링크로 카톡/트위터 미리보기 1회 확인 권장 (satori 폰트는 node_modules 경로 의존 — Vercel 번들 포함 여부)
- iOS Safari 리스크: `navigator.share` 파일 공유는 toBlob 지연(1~3초) 후 호출이라 transient activation 만료 가능성 — 실기기/응답형에서 카드 저장 실패 시 CPY-ERR-004 폴백 동작 확인

## Day 9 (**8/26 수**) — 스코프 컷 판정일: 이슈 #1 근본 원인 규명 + 유입 CTA(EL-RPT-008) 신설

> 브랜치 `feat/day9-report-cta`. PLAN Day 4~9 구간의 마지막 날 — 저녁 컷 판정이 이 날의 본체.

### Claude 담당

- [x] **이슈 #1 근본 원인 규명** — 이슈에 적혀 있던 "초장문 URL 미스크랩"을 실측으로 반증. 길이 단계별 재현 결과 **81자(해시無) ✅ / 102자(해시有) ❌ / 604자 ❌ / 1,400자 ❌** — 21자 차이로 길이 임계가 뒤집힐 수 없으므로 변수는 `#` 하나. **실제 원인 = 프래그먼트**. 이슈 제목·본문·코멘트 전부 정정
- [x] **선택지 2번(공유 전용 슬림 페이로드) 기각** — 해시 20자로도 실패했으므로 해시 크기를 줄이는 접근은 원리적으로 무효. "길이가 원인"이라는 잘못된 전제 위의 안이었음
- [x] **방향 판정 (sequential-thinking 9단계)** — C(유입 CTA) 즉시 / A'(카드 PNG 워터마크) 기각(이미지에서 도메인 수기 입력 사슬 — C보다 비용↑, "화면=이미지 단일 원본" 원칙도 훼손) / B(해시 없는 공유 링크 — OG 쿼리만으로 구성, 유실은 "최다 문장" 1줄) **Day 10~12 축 패스 이연 후보**
- [x] **유입 결함 발견·해소** — `/report` ready 분기에 랜딩으로 갈 출구가 전무했음("처음으로"는 error 분기에만 존재). 킬 크라이테리아 분모가 `users(page_view, '/')`이라 **공유 수신자가 표본 150 게이트에 아예 안 잡히고 있었음**. MVP "유입 = 공유" 전제에 엔진 출구가 없던 상태 — OG 수정보다 시급하다고 판단해 선행
- [x] **SCR-003 v1.1.0 → v1.2.0 (make-prd)** — EL-RPT-008 유입 CTA 신설(`entry=link` 한정, 링크 대상 `/?from=report`) · EL-RPT-007을 `entry=cli` 조건부로 변경 · REQ-RPT-003 + AC-1~4(007/008 배타 AC-2b 포함) · TC-RPT-003-01~04
- [x] **SSOT 정합 갱신** — 11 카피사전 CPY-RPT-003 / 15 분석추적 "공유 유입 전환(참고)" 지표 + **바이럴 되돌이 깔때기**(EVT-RES-001 entry=link → page_view `/?from=report` → EVT-LAND-001) / 04 정보구조 `?from=report`. **신규 EVT 없이** 랜딩 page_view 세그먼트로 측정
- [x] **EL-RPT-008 구현** — `report-client.tsx`, `state.entry`에 따라 007/008 배타 렌더
- [x] **한국어 줄바꿈 전역 수정** — `globals.css` body에 `break-keep` + `break-words` **쌍으로** 적용(요소별 대응이 아니라 전역 — 같은 누락의 재발 차단). 프로덕션 CSS에 `word-break:keep-all`·`overflow-wrap:break-word` 반영 확인, `<pre>` 무영향 확인. DESIGN.md에 근거 기록
- [x] 검증 — 웹 49 · CLI 33 tests / `next build` exit 0 / 390·768·1280 반응형 순회 / CTA 양쪽 분기 로컬 육안(사용자 확인)
- [x] EOD: history.md · 커밋 4건 · main 머지 · push — **배포 반영 실측 확인**(프로덕션 CSS `word-break:keep-all`)
- [x] **판정 ③④ PLAN 반영 (make-plan 경유)** — Day 11 섭외 마감 폐지·Day 13 '검증 세션' 개정·**실패 조건 9 방어력 약화 명시**·외부 눈 1명 확보 실패 시 Day 21 인터뷰 앞당김 보전 / '주 2회 실기기' 규칙을 실행 가능한 절차로 교체(맥 Safari 응답형 상시 + Day 16까지 실기기 수단 확보 + 실기기 전용 항목 폴백 선확보). 개정 이력은 **조정 횟수 미산입**(일정 불변)
- [x] **EOD 기록 세션 (8/26 저녁)** — Obsidian **신규 TIL 2건 + 보강 1건 + 정정 1건**(선행), Notion **정정 1 + 신규 4건 등록**(누적 31 → 35건). 원고 백업 `_notion-원고-scored-Day9.md`
  - Obsidian 신규 2건: `TIL-임계값-가설은-경계-두-점으로만-반증된다`(81 vs 102자) · `TIL-깔때기-분모에-도달-경로가-없으면-지표가-아니라-제품이-안-보인다`(EL-RPT-008)
  - **③은 신규 대신 보강으로 처리** — `keep-all`은 기존 `TIL-한글-웹-조판은-라틴과-다른-규칙이-최소-3개-있다`(2026-08-18, stackd)의 규칙 ①이라 같은 주제로 파일을 하나 더 만들지 않고 그 노트에 "덧붙임 (2026-08-26 · scored)" 절 추가 — `break-word`가 짝인 이유 · 전역 적용 근거 · 규칙이 프로젝트를 자동으로 따라오지 않는다는 사례. 코드 블록·요약·태그도 갱신
  - 정정 1건(선행 완료분): `TIL-카카오톡은-초장문-URL을-스크랩하지-않는다.md` 삭제 → `TIL-카카오톡은-프래그먼트-포함-URL을-스크랩하지-않는다.md` 교체 (백링크 0건 확인 후)
  - Notion 「개발 로그:scored」: **TS-26 정정 완료**(제목 "범인은 URL 길이" → "범인은 URL 길이가 아니라 #", 원인 문단에 Day 9 실측표·해결 문단에 선택지 2번 기각 후속 추가 — 삭제하지 않고 정정, 오판 자체가 기록 가치) + 과정요약 ⑥ + TS-27(임계값 가설 반증)·TS-28(깔때기 분모 유입 결함)·TS-29(`keep-all` 짝)
  - ⚠️ 등록 시 함정: Notion 페이지 **제목이 인라인 마크다운으로 파싱돼 단어가 유실됐다**(`[바이브 성적표] ⭐ … — …` → `[바이브 구조`). 대괄호를 `\[…\]`로 이스케이프해 `update_properties`로 재설정하면 정상. **생성 응답의 제목은 신뢰하지 말고 `notion-fetch`로 재확인할 것**

### 사용자 담당

- [x] **CTA 육안 검증** (localhost:3001) — link 진입 시 "내 성적표도 뽑아보기" 노출 / cli 진입 시 "내일 또 뽑아보세요" 노출, 양쪽 정상
- [x] **판정 ① 스코프 컷 대상 = 없음** (2026-08-26 확정) — Day 8·9 전 항목 완료. 실패 조건 3(컷 판정 회피) 통과
- [x] **판정 ② 이슈 #1 대응 = B안 Day 10~12 이연 확정** (2026-08-26) — 축 패스가 '공유 순간의 마이크로 인터랙션'을 이미 우선하므로 동일 축. 그때면 C안(EL-RPT-008) 효과가 GA4에 잡혀 판단 근거가 생김
- [x] **배포 URL 육안 확인** (`scored.kr` — 줄바꿈 + 유입 CTA) — 2026-08-26 정상 확인
- [ ] (Day 8 → **Day 13 검증 세션으로 이월**) `npx scored` 실행해 카드 저장·링크 복사 직접 체험 — 현재 `npx scored`는 **npm 미발행으로 404**(실측 2026-08-26). 로컬 체험은 `cd cli && npm run build && node dist/index.js`
- [x] **결정: npm publish `scored` → Day 10(8/27)에 실행** (2026-08-26) — 보류 해제. 랜딩·`/how`가 전부 `npx scored`를 안내하는데 레지스트리에 없으면 도달률(킬 1번) 첫 관문이 404다. 첫 publish는 이름·`files`·`bin` 권한에서 한 번은 걸리므로 런칭 근처로 미루지 않는다

### Day 9 → Day 10 인계

- **판정 4건 전부 종결** — 컷 없음 / B안 이연 확정 / ③④ PLAN 반영 완료. Day 9 게이트 통과
- 🆕 **Day 11(8/28 금)까지 외부 눈 1명 확보 시도** — 섭외 마감은 폐지됐지만 이건 남았다. 0명이면 실패 조건 9 발동 처리 후 Day 21 인터뷰를 런칭 직후로 앞당겨 보전
- 🆕 **Day 10(8/27) — `npm publish scored` 실행** (0.1.0). `prepublishOnly`가 build+test를 강제하므로 사전 검증은 자동. 발행 후 실제 `npx scored` 1회 완주 확인까지가 완료 조건
- 🆕 **Day 16 밤까지 실기기 수단 확보** — Xcode 시뮬레이터 설치(10GB+) 또는 지인 iPhone 대여. Day 17이 첫 실기기 접촉이라 그때 처음 터지는 결함은 고칠 시간이 없다
- **Day 10~12 축 패스로 이연된 것**: ① EVT-RES-002 공개 연출 ② **B안(해시 없는 공유 링크)** — 축 패스가 이미 "공유 순간의 마이크로 인터랙션"을 우선하므로 같은 축이고, 그때면 C안의 효과가 GA4에 잡혀 판단 근거가 생김
- **TC-RPT-003-01~04은 자동화 N** — 컴포넌트 렌더 테스트 인프라가 없어 육안 검증. **Day 15~16 E2E 도입 시 1순위 후보**
- 🆕 **EOD 기록 완료** — Day 9치 Obsidian·Notion 전부 당일 등록. Notion 누적 35건(과정요약 6 + 트러블슈팅 29)
- ♻️ **상시 주의(Day 10 이후에도 유효)**: Obsidian `~/obsidian/resume/dev-notes/`는 **scored·stackd 공용** — 원고 파일명 접두사(`_notion-원고-scored-` / `_notion-원고-stackd-`)를 반드시 확인하고, TIL 신규 작성 전 같은 주제 노트가 있는지 먼저 훑을 것(중복 대신 보강이 기본)
- **이슈 #1은 OPEN 유지** — 원인만 규명됐고 대응(A 수용 / B 구현)은 판정 ② 대기. 주 런칭 채널(GeekNews·디스콰이엇·X)의 프래그먼트 URL 처리도 Day 18~19 전 확인 필요

## Day 10 (**8/27 목**) — 중점 품질 축 패스 1일차: 모션 설계 확정

> 브랜치 `feat/day10-motion-design`. PLAN 지정 스킬 3종 적용 — find-animation-opportunities · animation-vocabulary · sequential-thinking(6단계). **연출 본체 구현은 Day 11~12** (PLAN 배분: Day 10 설계 → Day 11~12 animate/improve/review).

### Claude 담당

- [x] **모션 기회 스캔 + 게이트 판정** — 채택 3(공개 연출 전체·등급 릴 정지·공유 시트) / **기각 4**(대시보드 위젯 등장·히트맵 168셀 스태거·랜딩 장식·앵커 스무스 스크롤). 대시보드는 게이트 4(기능) 탈락 — 읽는 UI에서 데이터가 움직이면 판독 방해
- [x] **의존성 결정: 새 라이브러리 0** — SCR-002 §13의 "GSAP"을 미도입으로 확정. 필요한 모션 4종 중 CSS 불가는 숫자 카운트업뿐이고 rAF 루프 1개면 된다. `tw-animate-css` 기임포트, GSAP ~23KB는 LCP 2.5초 예산 대비 정당화 불가. **Day 11~12에 재론 금지** (근거 ANIMATION.md 기록)
- [x] **ANIMATION.md 확정** (14줄 → 122줄) — Day 0부터 비어 있던 이징·duration 빈칸 해소. 커스텀 이징 **2개만**(`--ease-out-quart`·`--ease-out-back`), **duration CSS 토큰 0개**(rAF와 CSS가 같은 숫자를 알아야 해 `reveal.ts` 상수 하나로 단일화 — 이중화하면 튜닝 때 반드시 어긋난다). 타임라인 예산 3종 + 산술 검산
- [x] **`globals.css` 토큰 정착** — `@theme inline`에 이징 2종 + `--animate-pop`, `@keyframes pop`. reduced-motion **전역 킬 블록은 넣지 않음** (`animation-duration:0.01ms !important` 대해머는 AC-4의 대체 페이드까지 죽인다)
- [x] **make-prd 경유 PRD 개정 3건** — ① SCR-002 v1.1.0→**v1.2.0**: AC-4·AC-5의 `skipped: false` 확정(연출을 건너뛴 주체가 사용자가 아니므로 스킵이 아니다) + AC-2에 Esc 추가 + §15 포커스 탈취 금지 명시 ② 11 카피사전 **CPY-RES-003 "오늘의 등급"** 신설 ③ 15 **EVT-SHARE-002 `method` enum 정정** — 명세 `download|clipboard`인데 코드에 clipboard 경로가 없었다. 실제 두 경로는 `download|share_sheet`
- [x] **G9 수정** — `share-sheet.tsx`가 모바일 `navigator.share` 경로를 타도 항상 `method:"download"` 발화하던 것을 `viaShareSheet` 분기로 정정. 이미 배포돼 지표를 오염시키던 건
- [x] **이슈 #2 등록** — 새로고침·`/report` 직접 진입 시 정상 링크가 "손상됐어요"(ERR-HASH-001)로 표시. `strippedUrl`이 BR-004를 이행하며 페이로드 해시까지 지우는데 Empty 상태(EL-RES-004)가 미구현이라 손상으로 흡수된다. **`result_failed` 지표까지 오염** → Day 11 상태 머신 작업과 한 묶음
- [x] **이슈 #1 B안 기각 처리** — 코멘트로 근거 기록, Day 18~19 채널 점검 이관, 이슈 OPEN 유지
- [x] **npm publish 사전 검증** — 무인증 범위 전부 통과. `npm view scored` → 404(이름 가용). 상세는 history.md
- [x] 검증 — 웹 49 · CLI 33 tests / `tsc --noEmit` · `next build` exit 0 / 빌드 CSS에 토큰 3종 실재 확인
- [x] EOD: history.md ✅ · TODO.md ✅ · PLAN 개정(make-plan) ✅ · 커밋 4건 ✅ · main 머지·push ✅ (6431362) — **배포 반영 실측 확인**(프로덕션 CSS `--ease-out-quart`·`--ease-out-back`·`@keyframes pop`)
- [ ] **EOD 기록 세션** (Obsidian TIL · Notion) — notion 플러그인 별도 세션

### 사용자 담당

- [x] **결정: 이슈 #1 B안 기각 → Day 18~19 이관** (2026-08-27) — 실측 결과 유실 범위가 Day 9 기록의 전제("최다 문장 1줄")보다 훨씬 컸다. 대시보드 5위젯 전부 미표시 + 유형 문구 `{streak}` 리터럴 노출 + 부분 모드 링크 생성 불가
- [ ] ⛔ **`npm login` 재인증** — Day 5의 `jong-yeon` 로그인이 만료(`npm whoami` E401). 브라우저 OAuth·2FA라 대행 불가. **이게 `npx scored` 발행의 유일한 잔여 블로커**
- [ ] **`npm publish scored` 승인·실행** (0.1.0) — 로그인 후. 발행 뒤 실제 `npx scored` 1회 완주 확인까지가 완료 조건
- [ ] **모션 감성 판정** — Day 11~12 구현 후 육안 승인. "어느 순간 웃었나"는 코드로 측정 불가하며 축 패스의 완료 조건
- [ ] **외부 눈 1명 확보** (Day 11 = 8/28 마감) — 0명이면 실패 조건 9 발동 처리 후 Day 21 인터뷰를 런칭 직후로 앞당겨 보전
- [ ] GA4 측정 ID 발급 확인 (OQ-005, Day 15 전)
- [ ] 실기기 수단 확보 (Day 16 밤 마감) — Xcode 시뮬레이터 10GB+ 또는 지인 iPhone 대여

### Day 10 → Day 11 인계

- **Day 11 첫 작업 = 연출 본체 구현.** 신규 `src/lib/reveal.ts`(순수 로직 — `PLAN` 상수·`reelIndex`·이징 함수, `node --test` 대상) + `src/components/report/reveal-stage.tsx`. `report-client.tsx` State 유니온에 `revealing` 추가
- 🆕 **이슈 #2를 같은 커밋에 묶을 것** — Empty 상태 분기가 `revealing` 추가와 같은 유니온·같은 이펙트를 건드린다. 따로 하면 같은 파일을 두 번 연다
- ⚠️ **`reelIndex` 음수 모듈로 주의** — 마지막 스텝이 반드시 판정 등급에 착지해야 한다. `start = ((finalIdx - (steps-1)) % len + len) % len`. 틀리면 재미 장치의 유일한 클라이맥스가 거짓말한다 → **테스트로 고정**
- ⚠️ **등급 릴 폭 고정 필수** — 등급이 `S·A+·A·B+·B·C`로 1~2자 혼재. `tabular-nums`는 숫자 전용이라 컨테이너에 고정 폭을 줘야 한다
- ⚠️ **카운트업 표기는 `src/lib/format.ts`의 `num`·`duration` 재사용** — 카드와 표기가 갈리면 안 된다. rAF는 ref의 `textContent` 직접 갱신(프레임마다 React 렌더 금지)
- **`stat-card.tsx`는 무수정 유지** — `toBlob` PNG 캡처 대상 + 서버 컴포넌트. 연출은 카드 바깥 스테이지에서만
- 잔여 미구현 EVT: **EVT-RES-002뿐** (연출과 함께 발화). 중복 발화 가드 필수 — 깔때기 지표다
- Day 12는 `improve-animations` → `review-animations` + chrome-devtools 60fps 루프. **LCP 2.5초 예산 재확인**은 Day 17이지만 연출이 LCP를 막지 않는지는 Day 12에 선확인
