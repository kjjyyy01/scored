# ANIMATION.md

## 고정 규칙

- Day 4~9 애니메이션 코드 금지(GSAP 포함) — 재미 장치의 "로직"만 구현, "연출"은 Day 10~12
- 모든 애니메이션은 cleanup 필수 (unmount 시 인스턴스 kill)
- `prefers-reduced-motion` 대응 필수
- 서버 렌더링 보존: 애니메이션이 콘텐츠 표시를 막으면 안 됨

## 축 확정 후 기입

- 이징 토큰: (Day 1 확정 후 기입 — 상세는 Day 10 모션 설계 시)
- duration 스케일: (Day 1 확정 후 기입 — 상세는 Day 10 모션 설계 시)
- 재미 장치 연출 우선순위: 결과 연출 > 기대감 빌드업 > 공유 순간 > 장식 (PLAN.md 고정)
