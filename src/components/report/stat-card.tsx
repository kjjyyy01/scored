// SCR-003 EL-RPT-001~003 스탯 카드 — 화면·공유 이미지·OG가 이 한 컴포넌트를 공유한다 (REQ-RPT-002 AC-1)
import type { Payload } from "../../../cli/src/types.ts";
import { isPartial } from "@/lib/payload.ts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// 활동 시간 312분 → "5시간 12분"
function duration(min: number): string {
  const h = Math.floor(min / 60);
  return h ? `${h}시간${min % 60 ? ` ${min % 60}분` : ""}` : `${min}분`;
}

const num = (n: number) => n.toLocaleString("ko-KR");

// EL-RPT-002 지표 6줄 — 산출 불가한 줄은 통째로 생략 (REQ-RPT-001 AC-5)
function rows(p: Payload): [string, string][] {
  const s = p.stats;
  const out: [string, string][] = [];
  if (typeof s?.prompts === "number") out.push(["프롬프트", `${num(s.prompts)}개`]);
  if (typeof s?.sessions === "number") out.push(["세션", `${num(s.sessions)}개`]);
  if (s?.tokens) out.push(["토큰", num((s.tokens.in ?? 0) + (s.tokens.out ?? 0))]);
  if (typeof s?.activeMinutes === "number") out.push(["활동 시간", duration(s.activeMinutes)]);
  const tool = s?.tools?.[0];
  if (tool) out.push(["최다 도구", `${tool[0]} ${num(tool[1])}회`]);
  const sentence = p.highlights?.sentences?.[0];
  if (sentence) out.push(["최다 문장", `“${sentence[0]}” ${sentence[1]}회`]);
  return out;
}

export function StatCard({ payload }: { payload: Payload }) {
  const partial = isPartial(payload);
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
        </div>

        {/* EL-RPT-001 유형·등급 + EL-RPT-003 유형 문구 — BR-009·BR-010 판정 모듈은 Day 7 (OQ-001·002).
            그때까지는 자리표시를 그리지 않는다: 이 카드가 랜딩 샘플에도 그대로 나가기 때문(SCR-001 EL-LAND-003) */}

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
          {rows(payload).map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-4 border-b border-border/60 pb-2 last:border-0">
              <dt className="shrink-0 text-sm text-muted-foreground">{label}</dt>
              {/* min-w-0 없으면 긴 문장이 flex 최소폭에 걸려 페이지에 가로 스크롤을 만든다 */}
              <dd className="min-w-0 text-right font-semibold tabular-nums break-words line-clamp-2">{value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
