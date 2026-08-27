// SCR-006 처리 방식 안내 — 신뢰 장치 + 법적 고지. 이 화면 자체가 근거라 JS 의존 금지 (§13)
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "처리 방식 — scored",
  description: "분석은 전부 브라우저와 내 컴퓨터에서. 무엇이 어디로 가고 무엇이 가지 않는지.",
};

// 표·코드 조각이 반복돼 작은 조각만 지역 컴포넌트로 뺀다
function Code({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em]">{children}</code>;
}

export default function HowPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16 md:px-6 md:py-24">
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">처리 방식</h1>
      <p className="mt-3 text-base leading-7 text-muted-foreground">
        scored는 서버에 계정도 데이터베이스도 두지 않습니다. 아래는 무엇이 어디에 남고, 무엇이 나가지 않는지에 대한 설명입니다.
      </p>

      {/* EL-HOW-001 무업로드 원리 */}
      <section className="mt-16 flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">세션 기록은 컴퓨터를 떠나지 않습니다</h2>
        <p className="text-base leading-7">
          <Code>npx @jong-yeon/scored</Code> 는 내 컴퓨터에서 <Code>~/.claude/projects</Code> 의 세션 기록을 읽어 그 자리에서 숫자로 집계합니다.
          대화 원문은 어디로도 보내지 않고, 집계된 숫자만 주소의 <Code>#</Code> 뒤 조각에 실려 브라우저로 넘어갑니다.
        </p>
        <p className="text-base leading-7">
          <Code>#</Code> 뒤 조각(프래그먼트)은 <strong>브라우저가 서버로 전송하지 않는다</strong>고 HTTP 표준에 정해져 있습니다.
          그래서 성적표를 여는 순간에도 우리 서버는 여러분의 숫자를 볼 수 없고, 접속 로그에도 남지 않습니다.
        </p>
        {/* 세로 흐름 — 가로 도식은 모바일(주 유입)에서 절반이 잘린다 */}
        <pre className="overflow-x-auto rounded-lg border border-border bg-muted/50 p-6 font-mono text-sm leading-7">
{`[ 내 컴퓨터 ]
  ~/.claude/projects
  대화 원문 ────── 안 나감
        │
        │ 숫자로만 집계
        ▼
[ 주소창 ]
  scored.kr/report
  #eNq1V21v... ── 전송 안 됨
        │
        ▼
[ 우리 서버 ]
  본 것: 없음`}
        </pre>
      </section>

      {/* EL-HOW-002 공유 시 전송 범위 */}
      <section className="mt-16 flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">공유할 때만, 이만큼이 전송됩니다</h2>
        <p className="text-base leading-7">
          결과 링크를 공유하면 카카오톡·슬랙 같은 곳이 미리보기 이미지를 만들려고 우리 서버를 호출합니다.
          그때만, 미리보기에 그릴 값이 주소의 일반 쿼리로 전달됩니다.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-base">
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="py-3 pr-4 font-semibold">전송됨</th>
                <th scope="col" className="py-3 font-semibold">전송되지 않음</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/60 align-top">
                <td className="py-3 pr-4 leading-7">오늘의 유형 · 등급 · 대상일 · 요약 숫자 지표 · 도구 이름</td>
                <td className="py-3 leading-7">대화 원문 · 자주 쓴 문장과 단어 · 파일 경로 · 프로젝트 이름</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground">
          자주 쓴 문장·단어는 기본적으로 공유 링크에서 빠집니다. 넣으려면 공유 화면에서 직접 켜야 하고, 켜더라도 미리보기 이미지에는 쓰이지 않습니다.
        </p>
      </section>

      {/* EL-HOW-003 GA4 고지 */}
      <section className="mt-16 flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">방문 통계</h2>
        <p className="text-base leading-7">
          어떤 화면이 얼마나 쓰이는지 보려고 Google Analytics를 씁니다. 보내는 것은 &ldquo;명령어를 복사했다&rdquo;,
          &ldquo;결과에 도달했다&rdquo;, &ldquo;링크를 복사했다&rdquo; 같은 <strong>행동의 발생 사실</strong>뿐입니다.
          성적표의 숫자·유형·등급·자주 쓴 문장은 통계로 보내지 않습니다.
        </p>
      </section>

      {/* EL-HOW-006 매일 뽑기 안내 — CPY-HOW-001 */}
      <section className="mt-16 flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">매일 뽑기</h2>
        <p className="text-base leading-7">
          매일 뽑으려면 셸에 <Code>alias sc=&quot;npx @jong-yeon/scored&quot;</Code> 를 넣어두세요. 대화 전체는 <Code>~/.scored/</Code> 에
          날짜별로 남고 (내 컴퓨터에만), <strong>최근 7일치만 보관하고 오래된 건 자동으로 지웁니다</strong>.
          지금 지우려면 <Code>rm -rf ~/.scored</Code>
        </p>
      </section>

      {/* EL-HOW-005 판정 기준 변경 고지 — CPY-COM-003 */}
      <section className="mt-16 flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">판정 기준</h2>
        <p className="text-base leading-7">
          성적표 판정 기준은 서비스 개선 시 바뀔 수 있어요 — 같은 링크라도 시점에 따라 등급이 달라질 수 있어요
        </p>
      </section>

      {/* EL-HOW-004 GitHub — 코드가 곧 증명 */}
      <section className="mt-16 flex flex-col gap-4 border-t border-border pt-8">
        <p className="text-base leading-7">
          위 설명이 사실인지는 코드로 확인할 수 있습니다.{" "}
          <a href="https://github.com/kjjyyy01/scored" className="font-medium text-primary underline underline-offset-4" target="_blank" rel="noopener noreferrer">
            github.com/kjjyyy01/scored
          </a>
        </p>
        <Link href="/" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
          처음으로
        </Link>
      </section>
    </main>
  );
}
