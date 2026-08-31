"use client";
// 전역 에러 바운더리 — ERR-APP-001. 판정·렌더 예외에서 흰 화면 금지 (19 DoD)
import { useEffect } from "react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";
import { Button } from "@/components/ui/button";

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  // React 바운더리가 예외를 삼켜 window.onerror에 안 뜬다 — 여기서 직접 보내야 수집된다
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col items-start gap-6 px-4 py-24 md:px-6" role="alert">
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">성적표를 그리다 문제가 생겼어요</h1>
      <p className="text-base leading-7 text-muted-foreground">
        다시 시도하거나 npx를 다시 실행해 주세요
      </p>
      <div className="flex flex-wrap gap-3">
        <Button onClick={retry} className="h-11 px-5">
          다시 시도
        </Button>
        <Button nativeButton={false} variant="outline" render={<Link href="/" />} className="h-11 px-5">
          처음으로
        </Button>
      </div>
    </main>
  );
}
