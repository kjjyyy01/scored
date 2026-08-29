import type { Metadata } from "next";
import Script from "next/script";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeToggle } from "@/components/theme-toggle";

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
  // OG 이미지 경로 등 절대 URL이 필요한 필드의 기준점
  metadataBase: new URL("https://scored.kr"),
  title: "scored",
  description: "AI 코딩 세션의 오늘을 스탯 카드로 — 무업로드·비로그인",
  openGraph: {
    title: "scored",
    description: "터미널 한 줄이면, 내 AI 코딩 성적표가 나온다",
    siteName: "scored",
    locale: "ko_KR",
    type: "website",
  },
};

// 측정 ID가 없으면 스크립트 자체를 넣지 않는다 — 이벤트 코드는 그대로 두고 발화만 안 된다
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* 첫 페인트 전에 테마를 확정한다 — afterInteractive면 다크에서 흰 화면이 한 프레임 번쩍인다 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");if(t)document.documentElement.dataset.theme=t}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeToggle />
        {children}
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}')`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
