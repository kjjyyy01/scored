// 정적 OG — 공유 미리보기의 1차 전달자 (PLAN: 위생이 아니라 핵심 기능)
// 결과별 동적 OG(/api/og)는 SCR-005 몫. 이건 링크에 결과가 없을 때의 기본값
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "scored — 터미널 한 줄이면, 내 AI 코딩 성적표가 나온다";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// 공유 카드·OG는 테마 무관 라이트 고정 (DESIGN.md)
const BG = "#ffffff";
const FG = "#292524";
const MUTED = "#78716c";
const PRIMARY = "#00713f"; // oklch(0.5 0.15 150) 근사 — satori는 oklch 미지원

const font = await readFile(
  join(process.cwd(), "node_modules/pretendard/dist/public/static/Pretendard-Bold.otf"),
);

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BG,
          color: FG,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
        }}
      >
        <div style={{ display: "flex", fontSize: 40, color: PRIMARY }}>scored</div>
        {/* satori는 \n을 접는다 — 줄은 요소로 나눈다 */}
        <div style={{ display: "flex", flexDirection: "column", fontSize: 76, lineHeight: 1.3, letterSpacing: -2 }}>
          <div>터미널 한 줄이면,</div>
          <div>내 AI 코딩 성적표가 나온다</div>
        </div>
        <div style={{ display: "flex", fontSize: 32, color: MUTED }}>
          npx scored · 서버 전송 0
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Pretendard", data: font, weight: 700, style: "normal" }] },
  );
}
