// 07 GET /api/og — 결과별 동적 OG (REQ-SHARE-003). 무DB·무상태, 쿼리 불량은 기본 이미지 폴백
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { parseOg, type OgParams } from "@/lib/og.ts";
import { TYPE_NAMES } from "@/lib/judge.ts";
import { duration, num } from "@/lib/format.ts";

// 공유 카드·OG는 테마 무관 라이트 고정 (DESIGN.md) — opengraph-image.tsx와 동일 팔레트
const BG = "#ffffff";
const FG = "#292524";
const MUTED = "#78716c";
const PRIMARY = "#00713f"; // oklch(0.5 0.15 150) 근사 — satori는 oklch 미지원
const SIZE = { width: 1200, height: 630 };
// 07: CDN 1일 재사용 + 백그라운드 갱신. immutable 금지 — 서버 코드 변경 시 이미지가 달라져야 함
const HEADERS = { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" };

const font = await readFile(
  join(process.cwd(), "node_modules/pretendard/dist/public/static/Pretendard-Bold.otf"),
);

// 카드 지표 ①~⑤ — 값 있는 것만 (최다 문장 ⑥은 BR-006으로 OG 금지)
function metrics(q: OgParams): string[] {
  const out: string[] = [];
  if (q.p !== undefined) out.push(`프롬프트 ${num(q.p)}`);
  if (q.s !== undefined) out.push(`세션 ${num(q.s)}`);
  if (q.k !== undefined) out.push(`토큰 ${num(q.k)}`);
  if (q.m !== undefined) out.push(duration(q.m));
  if (q.tl) out.push(q.tl);
  return out;
}

export async function GET(req: Request) {
  const q = parseOg(new URL(req.url).searchParams);

  const body = q ? (
    <div style={{ width: "100%", height: "100%", background: BG, color: FG, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 80 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 40 }}>
        <div style={{ color: PRIMARY }}>scored</div>
        {/* satori: 자식 2개면 display:flex 명시 필요 — 단일 문자열로 합쳐 회피 */}
        <div style={{ color: MUTED }}>{`${q.d}${q.ip ? " · 진행 중" : ""}`}</div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 36, color: MUTED }}>오늘의 유형</div>
          <div style={{ fontSize: 88, letterSpacing: -2, lineHeight: 1.2 }}>{TYPE_NAMES[q.t]}</div>
        </div>
        <div style={{ fontSize: 160, lineHeight: 1, color: PRIMARY }}>{q.g}</div>
      </div>
      <div style={{ display: "flex", fontSize: 30, color: MUTED }}>{metrics(q).join(" · ")}</div>
    </div>
  ) : (
    // 폴백 — 정적 OG(opengraph-image.tsx)와 동일 메시지 (ERR-OG-001 대응)
    <div style={{ width: "100%", height: "100%", background: BG, color: FG, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 80 }}>
      <div style={{ display: "flex", fontSize: 40, color: PRIMARY }}>scored</div>
      <div style={{ display: "flex", flexDirection: "column", fontSize: 76, lineHeight: 1.3, letterSpacing: -2 }}>
        <div>터미널 한 줄이면,</div>
        <div>내 AI 코딩 성적표가 나온다</div>
      </div>
      <div style={{ display: "flex", fontSize: 32, color: MUTED }}>npx scored · 서버 전송 0</div>
    </div>
  );

  return new ImageResponse(body, {
    ...SIZE,
    headers: HEADERS,
    fonts: [{ name: "Pretendard", data: font, weight: 700, style: "normal" }],
  });
}
