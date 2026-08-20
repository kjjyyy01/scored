import type { Metadata } from "next";
import { ReportClient } from "@/components/report/report-client";

export const metadata: Metadata = {
  title: "성적표 — scored",
  description: "AI 코딩 세션의 오늘 하루를 스탯 카드로. 분석은 전부 브라우저 안에서.",
};

// 페이로드는 URL 해시에 있어 서버가 볼 수 없다 — 데이터 복원은 클라이언트에서만.
// 서버는 뼈대와 무업로드 근거를 렌더한다 (JS 없이도 이 페이지가 무엇인지는 읽힌다)
export default function ReportPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 md:px-6 py-16 md:py-24">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight">오늘의 성적표</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        서버 전송 0 — 결과는 주소창 <code className="font-mono">#</code> 뒤 조각에만 들어 있고, 그 조각은 브라우저가 서버로 보내지 않습니다.
      </p>

      <div className="mt-12">
        <noscript>
          <p>이 페이지는 결과를 브라우저에서 직접 계산합니다. JavaScript를 켜 주세요.</p>
        </noscript>
        <ReportClient />
      </div>
    </main>
  );
}
