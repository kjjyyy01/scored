// SCR-001 랜딩 — npx 실행까지 유도(깔때기 1→2단계). 서버 렌더링: JS 없이 전 콘텐츠 노출
import Link from "next/link";
import { CommandCta } from "@/components/landing/command-cta";
import { StatCard } from "@/components/report/stat-card";
import { SAMPLE, SAMPLE_MARATHON } from "@/lib/sample.ts";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-16 md:px-6 md:py-24">
      <div className="grid gap-12 md:grid-cols-2 md:items-start md:gap-16">
        <div className="flex flex-col gap-6">
          {/* EL-LAND-005 신뢰 배지 — CPY-COM-001 */}
          <Link href="/how" className="w-fit rounded-lg focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
            <Badge variant="secondary" className="px-3 py-1">
              서버 전송 0 — 분석은 전부 내 컴퓨터에서
            </Badge>
          </Link>

          {/* EL-LAND-001 — CPY-LAND-001 */}
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            터미널 한 줄이면, 내 AI 코딩 성적표가 나온다
          </h1>
          <p className="text-base leading-7 text-muted-foreground">
            Claude Code가 남긴 오늘 하루의 세션 기록을 읽어 스탯 카드로 만듭니다. 설치도 로그인도 없고, 기록은 컴퓨터 밖으로 나가지 않습니다.
          </p>

          <CommandCta />
        </div>

        {/* EL-LAND-003 샘플 미리보기 */}
        <section aria-labelledby="sample-heading" className="flex flex-col gap-3">
          <h2 id="sample-heading" className="text-sm text-muted-foreground">
            이런 성적표가 나옵니다 (샘플)
          </h2>
          <StatCard payload={SAMPLE} />
          {/* 2장째는 md+ 전용 — 모바일에선 CTA가 첫 화면에서 밀린다 (SCR-001 §16) */}
          <div className="hidden md:block">
            <StatCard payload={SAMPLE_MARATHON} />
          </div>
        </section>
      </div>

      <footer className="mt-24 flex flex-wrap items-center gap-6 border-t border-border pt-8 text-sm text-muted-foreground">
        {/* EL-LAND-006 */}
        <a href="https://github.com/kjjyyy01/scored" className="underline-offset-4 hover:underline" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <Link href="/how" className="underline-offset-4 hover:underline">
          처리 방식
        </Link>
      </footer>
    </main>
  );
}
