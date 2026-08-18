// 터미널 문구 — 11 UX카피사전의 CPY-ID를 그대로 키로 쓴다 (문구 변경은 사전이 SSOT)
export const CPY = {
  "CLI-001": "세션 기록을 찾는 중… (~/.claude/projects)",
  "CLI-002": (day: string, n: number, p: number) => `${day} 세션 ${n}개 · 프롬프트 ${p}개 분석 완료 — 서버로 보내는 데이터는 없어요`,
  "CLI-003": "브라우저에서 성적표를 열고 있어요. 안 열리면 위 링크를 복사하세요",
  "CLI-004": (day: string) => `오늘 대화 전체는 ~/.scored/${day}.html 에 저장했어요. 내일 또 뽑아보세요 — alias sc="npx scored"`,
  "ERR-006": "~/.claude/projects 폴더를 찾지 못했어요. Claude Code를 사용한 머신에서 실행해 주세요",
  "ERR-007": "분석할 세션이 없어요. Claude Code로 코딩한 뒤 다시 실행해 주세요",
  "ERR-008": "브라우저를 자동으로 열지 못했어요 — 위 링크를 복사해 브라우저에 붙여넣어 주세요",
  "ERR-010": "대화 리포트 파일을 만들지 못했어요 (~/.scored 쓰기 실패) — 성적표는 정상이에요",
} as const;
