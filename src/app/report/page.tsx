import type { Metadata } from "next";
import { ReportClient } from "@/components/report/report-client";
import { parseOg } from "@/lib/og.ts";

// REQ-SHARE-003: 공유 URL의 OG 쿼리(07)를 검증해 동적 OG 이미지로 — 불량·부재면 정적 OG 상속
export async function generateMetadata(
  { searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> },
): Promise<Metadata> {
  const base: Metadata = {
    title: "성적표 — scored",
    description: "AI 코딩 세션의 오늘 하루를 스탯 카드로. 분석은 전부 브라우저 안에서.",
    // 04 §메타데이터·색인 규약 — `?from=cli`·OG 쿼리를 뺀 경로만 (해시는 서버에 오지 않는다)
    alternates: { canonical: "/report" },
  };
  const sp = new URLSearchParams(
    Object.entries(await searchParams).flatMap(([k, v]) => (typeof v === "string" ? [[k, v]] : [])),
  );
  const q = parseOg(sp);
  if (!q) return base;
  // 검증 통과값만 재인코딩해 전달 — 원 쿼리 패스스루 금지 (서버 측 검증)
  const clean = new URLSearchParams();
  for (const [k, v] of Object.entries(q)) {
    if (v === undefined || v === false) continue;
    clean.set(k, v === true ? "1" : String(v));
  }
  return { ...base, openGraph: { images: [{ url: `/api/og?${clean}`, width: 1200, height: 630 }] } };
}

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
