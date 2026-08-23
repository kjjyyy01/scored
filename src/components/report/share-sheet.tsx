"use client";
// SCR-005 공유 카드 — /report 내 오버레이. 킬 크라이테리아 2번(공유·저장률)의 발생 지점
// 오버레이는 네이티브 <dialog>: 포커스 트랩·Esc·백드롭·inert가 공짜 (shadcn Dialog/Drawer 미도입)
import { useEffect, useRef, useState } from "react";
import type { Payload } from "../../../cli/src/types.ts";
import { shareUrl } from "@/lib/payload.ts";
import { StatCard } from "./stat-card";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics.ts";

export function ShareSheet({ payload, open, onClose }: { payload: Payload; open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [withHighlights, setWithHighlights] = useState(false); // BR-004 기본 OFF
  const [notice, setNotice] = useState("");
  const hasHighlights = Boolean(payload.highlights?.sentences?.length);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  // §6 뒤로가기 = 오버레이 닫기(페이지 이탈 아님). 닫기 요청을 전부 history.back()으로 모아
  // 뒤로가기·Esc·X·백드롭이 같은 경로를 타게 한다 — 히스토리 항목이 새지 않는다
  useEffect(() => {
    if (!open) return;
    history.pushState({ share: true }, "");
    const onPop = () => onClose();
    addEventListener("popstate", onPop);
    return () => removeEventListener("popstate", onPop);
  }, [open, onClose]);

  const requestClose = () => history.back();

  async function onCopyLink() {
    try {
      const url = await shareUrl(payload, withHighlights, location.origin);
      await navigator.clipboard.writeText(url);
      track("link_copied", { highlight_included: withHighlights });
      setNotice("링크를 복사했어요");
    } catch {
      setNotice("자동 복사가 안 됐어요 — 아래 텍스트를 직접 복사해 주세요");
    }
  }

  return (
    <dialog
      ref={ref}
      onCancel={(e) => { e.preventDefault(); requestClose(); }}
      onClick={(e) => { if (e.target === ref.current) requestClose(); }}
      aria-labelledby="share-title"
      className="m-0 max-h-[90dvh] w-full max-w-lg overflow-y-auto border border-border bg-background p-6 text-foreground backdrop:bg-black/50
                 mt-auto rounded-t-xl md:m-auto md:rounded-xl"
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <h2 id="share-title" className="text-2xl font-semibold">공유</h2>
          <Button variant="ghost" onClick={requestClose} className="h-11 px-4" aria-label="닫기">닫기</Button>
        </div>

        {/* EL-SHARE-001 — SCR-003과 동일 컴포넌트·동일 값 (REQ-RPT-002) */}
        <StatCard payload={payload} />

        {/* EL-SHARE-004 — highlights가 있을 때만. 네이티브 체크박스에 switch 역할 부여 */}
        {hasHighlights && (
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              role="switch"
              checked={withHighlights}
              onChange={(e) => setWithHighlights(e.target.checked)}
              className="mt-0.5 size-5 shrink-0 accent-primary"
            />
            <span>자주 쓴 문장·단어 포함하기 — 포함하면 그 문장들이 링크에 실려요</span>
          </label>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          {/* EL-SHARE-002 — REQ-SHARE-001 카드 PNG는 Day 8 (클라이언트 캔버스 렌더러) */}
          <Button variant="outline" disabled className="h-11 px-5 sm:flex-1">카드 저장 (준비 중)</Button>
          {/* EL-SHARE-003 */}
          <Button onClick={onCopyLink} className="h-11 px-5 sm:flex-1">링크 복사</Button>
        </div>

        <p aria-live="polite" className="min-h-5 text-sm text-primary">{notice}</p>

        {/* EL-SHARE-005 — CPY-SHARE-004 */}
        <p className="text-sm text-muted-foreground">
          공유 시 유형·등급·요약 숫자만 미리보기 이미지에 쓰여요
        </p>
      </div>
    </dialog>
  );
}
