// 404 — 위생 항목. 막다른 길에서 랜딩으로 되돌린다
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col items-start gap-6 px-4 py-24 md:px-6">
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">없는 주소예요</h1>
      <p className="text-base leading-7 text-muted-foreground">
        성적표 링크라면 <code className="font-mono">#</code> 뒤 조각까지 통째로 복사됐는지 확인해 주세요.
      </p>
      <Button nativeButton={false} render={<Link href="/" />} className="h-11 px-5">
        처음으로
      </Button>
    </main>
  );
}
