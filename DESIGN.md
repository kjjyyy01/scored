# DESIGN.md

## 고정 규칙 (서비스 무관)

- 정렬 축: 모든 섹션·컴포넌트의 시작 축이 일치해야 한다 — 위반은 버그로 취급
- 브레이크포인트: Tailwind 내장(sm/md/lg/xl)만 사용, 커스텀 정의 금지
- 반응형: 모바일~데스크톱 대응이 완료 조건 — 모바일 퍼스트로 구현
- 간격: 넉넉하고 일관된 스페이싱 (design-taste-frontend 방향: 밋밋한 UI 금지)

## 서비스 확정 토큰 (2026-08-15 기입 — sequential-thinking 5단계로 결정)

> 원칙: 커스텀 토큰은 최소. Tailwind 내장 스케일 중 **쓸 단계만 지정**하고, 색은 shadcn CSS 변수만 쓴다. 아래 표 밖의 값을 쓰면 리뷰에서 지적.

### 서체 (`next/font`)
| 역할 | 서체 | 설정 |
|---|---|---|
| sans (본문·헤드라인·숫자) | **Pretendard Variable** — `next/font/local`, `pretendard` npm 패키지의 `PretendardVariable.woff2` 1개 | `display: "swap"`, `preload: true`, `adjustFontFallback` 기본(자동 size-adjust), CSS 변수 `--font-sans` |
| mono (npx 명령어 코드 블록) | Geist Mono (`next/font/google`, 현재 템플릿 유지) | latin subset만 — 소용량 |
| 숫자 | sans + `tabular-nums` | 지표 카드·등급·대시보드 수치 정렬 |

- 디스플레이 전용 서체 추가 금지 (YAGNI) — 과감함은 크기·굵기(Pretendard 700~800)로 낸다.
- LCP: 웹폰트는 위 2개뿐. 히어로 텍스트는 swap으로 즉시 페인트.

### 타이포 스케일 (역할 5개만)
| 역할 | 클래스 | 용도 |
|---|---|---|
| display | `text-6xl md:text-8xl font-extrabold tracking-tight leading-none` | 등급 글자·유형명 (성적표 주인공) |
| h1 | `text-4xl md:text-5xl font-bold tracking-tight` | 랜딩 헤드라인·화면 제목 |
| h2 | `text-2xl font-semibold` | 섹션·카드 제목 |
| body | `text-base leading-7` | 본문 (한글 행간 1.75) |
| caption | `text-sm text-muted-foreground` | 보조 설명·고지 |

### 스페이싱 (4px 그리드, 사용 단계 고정)
- 허용 단계: `2 · 3 · 4 · 6 · 8 · 12 · 16 · 24` (0.5rem~6rem). 그 밖 값 사용 금지.
- 컨테이너: `mx-auto px-4 md:px-6` + `max-w-3xl`(성적표·대시보드·안내 — 읽기 폭) / `max-w-5xl`(랜딩). **정렬 축 = 이 px 값 하나**.
- 섹션 간격 `py-16 md:py-24`, 카드 내부 `p-6`, 요소 간 `gap-4` / `gap-6`, 지표 카드 그리드 `grid gap-4 md:grid-cols-2`.

### 컬러 팔레트 (shadcn CSS 변수가 SSOT)
| 항목 | 값 |
|---|---|
| base color (`shadcn init`) | **stone** — 성적표 = 종이 느낌, zinc 대시보드 클리셰 회피 |
| `--primary` (유일한 커스텀 색) | **임시(2026-08-18 init)**: shadcn `orange` 테마 — 라이트 `oklch(0.553 0.195 38.402)` / 다크 `oklch(0.47 0.157 37.304)`, foreground `oklch(0.98 0.016 73.684)` (대비 검증된 쌍). 후보였던 형광 `oklch(0.70 0.19 45)`는 흰 글자 대비 ≈2.7:1로 **버튼·배지 배경 부적합** — 쓰려면 비텍스트 강조(도장·밑줄) 전용 변수로 분리. 대안 딥 그린 `oklch(0.55 0.15 150)`. **SCR-003 카드 첫 렌더일에 실물 위에서 30분 내 사용자 확정 → 이 칸 갱신** |
| 등급·유형 색 | **없음** — 등급은 색이 아니라 크기·굵기·연출로 (팔레트 폭발 방지, 재미 장치 1개 규칙과 정합) |
| 차트(SCR-004) | primary 단색 + 농도(opacity)만. 색상 추가 금지 (dataviz 스킬은 SCR-004 구현 시점에 로드) |
| 공유 카드·OG 이미지 | 테마 무관 **라이트 고정** (미리보기 일관성) |
| 반경·그림자 | shadcn 기본 (`--radius: 0.625rem`) 유지 |

### 다크모드
- v1: **시스템 추종만** — shadcn 다크 변수를 `@media (prefers-color-scheme: dark)`에 정의 (스크립트 0, JS 없이 동작 — 마크업 위생 규칙). 토글 UI·`.dark` 클래스 방식은 v2 backlog. (2026-08-18 적용: init이 만든 `.dark` 블록·`@custom-variant dark`를 미디어쿼리로 전환 — Tailwind `dark:` 변형도 기본값인 미디어쿼리 기준)

## 컴포넌트 라이브러리: shadcn/ui (2026-08-15 PRD 피드백 Q3)

- 원칙: 화면 문서(SCR)의 "컴포넌트" 열은 일반 명칭 — 구현은 아래 매핑으로 shadcn/ui 사용. 매핑에 없는 요소만 직접 작성
- **로컬 대화 리포트 HTML**(CLI-001 REQ-CLI-003)은 웹 번들 밖 정적 파일 — shadcn 미사용, 위 토큰(stone 팔레트·Pretendard 시스템 폴백·spacing 단계)만 인라인 CSS로 재사용해 톤을 맞춘다
- **등급 뱃지·유형 타이틀**: 색 없음 — display 타이포+굵기로. 카드 이미지·OG도 동일 컴포넌트에서 렌더(SCR-003 REQ-RPT-002)
- 도입: ~~Day 4 `npx shadcn@latest init`~~ **2026-08-18 완료** — `base-nova` 스타일(Base UI) · baseColor stone · theme orange · lucide, Tailwind v4·React 19 확인. 필요한 컴포넌트만 `add` (전체 설치 금지)
- 팔레트·타이포는 shadcn CSS 변수(`--background`·`--primary` 등)를 SSOT로 — 위 "서비스 확정 후 기입" 항목은 이 변수값으로 기입

| 화면 문서 명칭 | shadcn/ui | 비고 |
|---|---|---|
| 버튼·CTA | `Button` | 복사 CTA는 `variant` 구분 |
| 토스트 | `Sonner` | CPY-LAND-003 등 |
| 카드·지표 카드·헤더 카드·인용 카드 | `Card` | SCR-003·004 |
| 배지 | `Badge` | CPY-COM-001 신뢰 배지 |
| 탭 내비 | `Tabs` | 성적표 ⇄ 대시보드 |
| 토글 | `Switch` | 발췌 포함 토글 (EL-SHARE-004) |
| 바텀시트(모바일) / 중앙 모달(md+) | `Drawer` / `Dialog` | SCR-005 반응형 분기 |
| 에러·안내 카드 | `Alert` | ERR-HASH·Empty 안내 |
| 스피너 | `Skeleton` 또는 `Loader2` 아이콘 | SCR-005 Loading |
| 코드 블록(npx 명령어) | 직접 작성 (`<pre><code>` + Button) | shadcn 미제공 |
| 차트·히트맵 | 직접 작성 (CSS/SVG) | SCR-004 §13 — 번들 예산 |
