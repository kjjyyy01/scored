// SCR-003 EL-RPT-001~003 스탯 카드 — 화면·공유 이미지·OG가 이 한 컴포넌트를 공유한다 (REQ-RPT-002 AC-1)
import type { Payload } from "../../../cli/src/types.ts";
import { isPartial } from "@/lib/payload.ts";
import { judge } from "@/lib/judge.ts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { rows } from "@/lib/rows.ts";

export function StatCard({ payload }: { payload: Payload }) {
  const partial = isPartial(payload);
  // BR-002: 부분 모드에선 판정하지 않는다 (prompts ≥ 10 전제가 judge의 계약)
  const judged = partial ? null : judge(payload);
  const time = payload.generatedAt
    ? new Date(payload.generatedAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false })
    : "";

  return (
    <Card className="w-full">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <time className="text-sm text-muted-foreground tabular-nums" dateTime={payload.day}>
            {payload.day}
          </time>
          {/* AC-6 진행 중 배지 — CPY-RPT-002 */}
          {payload.inProgress && <Badge variant="secondary">진행 중 · {time} 기준</Badge>}
          {/* EL-RPT-001 등급 뱃지 — 색 없음(DESIGN), 점수는 등급 계산값 그대로 (BR-009) */}
          {judged && (
            <Badge variant="outline" className="ml-auto text-sm font-bold tabular-nums">
              {judged.grade} · {judged.score}점
            </Badge>
          )}
        </div>

        {/* EL-RPT-001 유형 타이틀 + EL-RPT-003 유형 문구 — display 타이포·색 없음(DESIGN).
            display 원 스케일(6xl/8xl)은 전면 히어로 기준이라 카드 안에선 한 단계 낮춰 적용 */}
        {judged && (
          <>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight break-keep">
              {judged.typeName}
            </h2>
            <p className="text-sm text-muted-foreground">{judged.copy}</p>
          </>
        )}

        {/* BR-002 데이터 부족 모드 — ERR-DATA-001 */}
        {partial && (
          <p className="text-sm text-muted-foreground">
            오늘은 아직 채점할 만큼 안 하셨네요 — 프롬프트 10개부터 채점해요. 좀 더 하고 다시 뽑아보세요
          </p>
        )}
      </CardHeader>

      <CardContent>
        {/* grid-cols-1 = minmax(0,1fr): 암시적 auto 컬럼은 min-width:auto라 긴 문장이 컨테이너를 밀어낸다 */}
          <dl className="grid grid-cols-1 gap-3">
          {rows(payload).map(({ label, to, text }) => (
            <div key={label} className="flex items-baseline justify-between gap-4 border-b border-border/60 pb-2 last:border-0">
              <dt className="shrink-0 text-sm text-muted-foreground">{label}</dt>
              {/* min-w-0 없으면 긴 문장이 flex 최소폭에 걸려 페이지에 가로 스크롤을 만든다 */}
              <dd className="min-w-0 text-right font-semibold tabular-nums break-words line-clamp-2">{text(to)}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
