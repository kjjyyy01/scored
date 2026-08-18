import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// 본문·헤드라인·숫자: Pretendard 가변 1파일 (DESIGN.md 서체)
// ponytail: 2MB 단일 woff2 + swap. Day 17 LCP 미달 시 dynamic-subset CSS로 교체
const pretendard = localFont({
  src: "../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  variable: "--font-sans",
  display: "swap",
  weight: "45 920",
});

// npx 명령어 코드 블록 전용 (latin만)
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "scored",
  description: "AI 코딩 세션의 오늘을 스탯 카드로 — 무업로드·비로그인",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
