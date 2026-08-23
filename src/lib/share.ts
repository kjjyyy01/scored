// SCR-001 REQ-LAND-001·002 — 복사·나에게 보내기. DOM 없이 테스트하려 의존성 주입식
export const NPX_COMMAND = "npx scored"; // CPY-LAND-002

type Clip = (text: string) => Promise<void>;
type Share = (data: { text: string; url: string }) => Promise<void>;

// 복사 실패(권한 거부·비보안 컨텍스트)면 텍스트 자동 선택으로 폴백 — ERR-CLIP-001
export async function copyCommand(clip: Clip, selectFallback: () => void): Promise<"clipboard" | "select"> {
  try {
    await clip(NPX_COMMAND);
    return "clipboard";
  } catch {
    selectFallback();
    return "select";
  }
}

// Web Share 우선, 미지원·취소면 클립보드 (AC-2). 반환값이 곧 EVT-LAND-002의 method
export async function sendToSelf(share: Share | undefined, clip: Clip, url: string): Promise<"share_sheet" | "clipboard"> {
  if (share) {
    try {
      await share({ text: NPX_COMMAND, url });
      return "share_sheet";
    } catch {
      // 사용자 취소·권한 거부 — 아래 클립보드로 내려간다
    }
  }
  await clip(`${NPX_COMMAND}\n${url}`);
  return "clipboard";
}
