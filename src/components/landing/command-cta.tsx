"use client";
// SCR-001 EL-LAND-002·004 — 복사(REQ-LAND-001) · 나에게 보내기(REQ-LAND-002)
// 서버 렌더링 위생: 명령어 텍스트 자체는 서버가 그리고, 이 컴포넌트는 버튼만 붙인다
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics.ts";
import { copyCommand, sendToSelf, NPX_COMMAND } from "@/lib/share.ts";

const clip = (t: string) => navigator.clipboard.writeText(t);

export function CommandCta() {
  const codeRef = useRef<HTMLElement>(null);
  // ponytail: 토스트 대신 CTA 옆 인라인 피드백 + aria-live. 알림이 여러 종류로 늘면 sonner 도입
  const [notice, setNotice] = useState("");

  // 명령어를 통째로 드래그 선택시켜 두면 Cmd+C 한 번으로 끝난다 (ERR-CLIP-001 폴백)
  function selectCommand() {
    const el = codeRef.current;
    if (!el) return;
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }

  async function onCopy() {
    track("npx_command_copied"); // AC-4: 복사 성공 여부와 무관하게 클릭 의도를 잰다
    const how = await copyCommand(clip, selectCommand);
    setNotice(
      how === "clipboard"
        ? "복사됐어요 — 터미널에 붙여넣으세요"
        : "자동 복사가 안 됐어요 — 아래 텍스트를 직접 복사해 주세요",
    );
  }

  async function onSend() {
    const share = navigator.share
      ? (d: { text: string; url: string }) => navigator.share(d)
      : undefined;
    try {
      const method = await sendToSelf(share, clip, window.location.href);
      track("command_self_sent", { method });
      if (method === "clipboard") setNotice("복사됐어요 — 터미널에 붙여넣으세요");
    } catch {
      setNotice("자동 복사가 안 됐어요 — 아래 텍스트를 직접 복사해 주세요");
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* CPY-LAND-005 — npx를 실행할 수 없는 환경에만. 아래 CTA의 이유를 먼저 준다 */}
      <p className="order-1 text-sm text-muted-foreground md:hidden">
        지금은 폰이시네요 — 명령어를 보내두고 데스크톱에서 실행하세요
      </p>

      {/* EL-LAND-004 — 모바일에선 코드 블록 위 = 주 CTA (npx 실행 불가 환경의 유일한 행동) */}
      <Button variant="outline" onClick={onSend} className="order-2 h-11 w-full px-5 md:order-4 md:w-fit">
        명령어 나에게 보내기
      </Button>

      {/* EL-LAND-002 */}
      <div className="order-3 flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-2 pl-4 md:order-2">
        <code ref={codeRef} className="min-w-0 flex-1 truncate font-mono text-base">
          {NPX_COMMAND}
        </code>
        <Button onClick={onCopy} className="h-11 shrink-0 px-5">
          복사
        </Button>
      </div>

      {/* 클릭 뒤에만 채워지지만 자리는 미리 잡아 둔다 — 버튼이 밀려나면 오조작이 난다 */}
      <p aria-live="polite" className="order-4 min-h-5 text-sm text-primary-text md:order-3">
        {notice}
      </p>
    </div>
  );
}
