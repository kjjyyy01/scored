"use client";
// SCR-002 진입 처리 — 해시 디코딩(06) · BR-004 주소창 정리 · ERR-HASH 분기
// 연출(Revealing)은 Day 10~12 축 패스 — 지금은 로직만 (PLAN Day 4~9 규칙)
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Payload } from "../../../cli/src/types.ts";
import { decodeHash, strippedUrl, type DecodeResult } from "@/lib/payload.ts";
import { StatCard } from "./stat-card";
import { ShareSheet } from "./share-sheet";
import { Dashboard } from "./dashboard";
import { track } from "@/lib/analytics.ts";
import { Button } from "@/components/ui/button";

type State =
  | { phase: "decoding" }
  | { phase: "ready"; payload: Payload; entry: "cli" | "link" }
  | { phase: "error"; code: string };

// 해시와 진입 출처는 딱 한 번만 집어온다. BR-004로 주소창을 즉시 비우기 때문에, 두 번째로 읽으면 이미 없다
// (React StrictMode의 이펙트 이중 실행·컴포넌트 재마운트에서 실제로 터진다)
type Entry = { hash: string; entry: "cli" | "link" };
let captured: Entry | null = null;
function takeEntry(): Entry {
  if (captured === null) {
    captured = {
      hash: window.location.hash,
      // 도달률 분자는 entry=cli만 — 공유 링크 열람이 npx 마찰 지표를 부풀리지 않게 (15)
      entry: new URLSearchParams(window.location.search).get("from") === "cli" ? "cli" : "link",
    };
  }
  return captured;
}

const MESSAGE: Record<string, string> = {
  "ERR-HASH-001": "결과 링크가 손상됐어요 — npx scored를 다시 실행해 주세요",
  "ERR-HASH-002": "새 버전의 결과예요 — npx scored@latest로 다시 만들어 주세요",
};

export function ReportClient() {
  const [state, setState] = useState<State>({ phase: "decoding" });
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    const { hash, entry } = takeEntry();

    // dev 전용: ?primary=<css color> 로 실물 카드 위에서 색 후보를 갈아끼운다 (DESIGN.md --primary 확정용)
    if (process.env.NODE_ENV === "development") {
      const c = new URLSearchParams(window.location.search).get("primary");
      if (c) document.documentElement.style.setProperty("--primary", c);
    }

    // BR-004: 디코딩 전에 주소창부터 지운다 — 하이라이트 원문이 히스토리에 남지 않게
    history.replaceState(null, "", strippedUrl(window.location.href));

    let alive = true;
    decodeHash(hash).then((r: DecodeResult) => {
      if (!alive) return;
      if (r.ok) {
        // EVT-RES-001 — 킬 크라이테리아 1번(도달률)의 분자. 성적 데이터는 싣지 않는다 (14 §5)
        track("result_reached", { entry, has_highlights: Boolean(r.payload.highlights?.sentences?.length) });
        setState({ phase: "ready", payload: r.payload, entry });
      } else {
        track("result_failed", { error_code: r.error }); // EVT-RES-003 마찰 측정
        setState({ phase: "error", code: r.error });
      }
    });
    return () => { alive = false; };
  }, []);

  if (state.phase === "decoding") {
    return <p className="text-sm text-muted-foreground">결과를 읽는 중…</p>;
  }

  if (state.phase === "error") {
    return (
      <div className="grid grid-cols-1 gap-6" role="alert">
        <p>{MESSAGE[state.code] ?? MESSAGE["ERR-HASH-001"]}</p>
        {/* Base UI Button은 asChild가 아니라 render prop. h-11 = 44px 탭 타깃 */}
        <Button nativeButton={false} render={<Link href="/" />} className="h-11 w-fit px-5">
          처음으로
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <StatCard payload={state.payload} />
      {/* EL-RPT-005 공유 CTA — EVT-SHARE-001은 이 화면 소유 */}
      <Button
        className="h-11 w-full px-5 sm:w-fit"
        onClick={() => { track("share_opened"); setSharing(true); }}
      >
        공유하기
      </Button>
      <ShareSheet payload={state.payload} open={sharing} onClose={() => setSharing(false)} />
      {/* EL-RPT-006 상세 보기 앵커 — 아래 SCR-004 섹션으로 스크롤 (탭 아님) */}
      <a href="#dashboard" className="w-fit text-sm text-muted-foreground underline-offset-4 hover:underline">
        ↓ 오늘의 기록 자세히 보기
      </a>
      {/* EL-RPT-007 재실행 안내 — CPY-RPT-001 */}
      <p className="text-sm text-muted-foreground">내일 또 뽑아보세요 — 하루가 바뀌면 유형도 바뀝니다</p>

      {/* SCR-004 — 한 스크롤 페이지 하단 섹션. EVT-DASH-001은 이 화면(SCR-003) 소유 (15) */}
      <div className="mt-6">
        <Dashboard payload={state.payload} entry={state.entry} onFirstView={() => track("dashboard_viewed")} />
      </div>
    </div>
  );
}
