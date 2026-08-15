# DESIGN.md

## 고정 규칙 (서비스 무관)

- 정렬 축: 모든 섹션·컴포넌트의 시작 축이 일치해야 한다 — 위반은 버그로 취급
- 브레이크포인트: Tailwind 내장(sm/md/lg/xl)만 사용, 커스텀 정의 금지
- 반응형: 모바일~데스크톱 대응이 완료 조건 — 모바일 퍼스트로 구현
- 간격: 넉넉하고 일관된 스페이싱 (design-taste-frontend 방향: 밋밋한 UI 금지)

## 서비스 확정 후 기입

- 스페이싱 스케일: (Day 1 확정 후 기입)
- 타이포그래피(서체·스케일): (Day 1 확정 후 기입)
- next/font 설정: (Day 1 확정 후 기입)
- 컬러 팔레트: (Day 1 확정 후 기입)

## 컴포넌트 라이브러리: shadcn/ui (2026-08-15 PRD 피드백 Q3)

- 원칙: 화면 문서(SCR)의 "컴포넌트" 열은 일반 명칭 — 구현은 아래 매핑으로 shadcn/ui 사용. 매핑에 없는 요소만 직접 작성
- 도입: Day 4 `npx shadcn@latest init` (Tailwind v4·React 19 호환 확인) → 필요한 컴포넌트만 `add` (전체 설치 금지)
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
