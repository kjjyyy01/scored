"use client";
// 테마 토글 — 라이트 ↔ 다크. globals.css의 color-scheme 하나만 바꾼다
// 선택 전에는 data-theme이 비어 있고 CSS가 OS를 따른다 (시스템 추종은 기본 동작으로 남는다)
import { useLayoutEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

type Theme = "light" | "dark";

const META: Record<Theme, { icon: typeof Sun; label: string }> = {
  light: { icon: Sun, label: "밝게" },
  dark: { icon: Moon, label: "어둡게" },
};

// 진실의 원천은 <html data-theme> 하나다 — 상태를 따로 들면 인라인 스크립트가 먼저 쓴 값과 갈라진다
let listeners: (() => void)[] = [];
const systemDark = () => matchMedia("(prefers-color-scheme: dark)");
const subscribe = (cb: () => void) => {
  listeners.push(cb);
  // 선택 전에는 아이콘이 OS를 따라가야 한다 — 토글은 세션 내내 떠 있으므로 리스너가 필요하다
  const mq = systemDark();
  mq.addEventListener("change", cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
    mq.removeEventListener("change", cb);
  };
};
// 선택이 없으면 시스템 실효값을 읽는다 — CSS는 color-scheme: light dark로 이미 그렇게 그리고 있다
const read = (): Theme =>
  (document.documentElement.dataset.theme as Theme) || (systemDark().matches ? "dark" : "light");
// 서버는 OS도 선택도 모른다. 아이콘 한 개짜리 차이라 마운트 후 교체를 허용한다
const readServer = (): Theme => "light";

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, read, readServer);

  // dev 전용 보정: Strict Mode 리마운트에서 React가 <html>을 JSX가 아는 속성만 남기고 리셋해
  // 인라인 스크립트가 심은 data-theme이 지워진다. 프로덕션에선 no-op (Next.js 공식 가이드)
  useLayoutEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved && document.documentElement.dataset.theme !== saved) {
      document.documentElement.dataset.theme = saved;
      listeners.forEach((l) => l());
    }
  }, []);

  // 누르는 순간부터 시스템 추종을 벗어나 선택이 고정된다
  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
    listeners.forEach((l) => l());
  };

  const { icon: Icon, label } = META[theme];
  return (
    <Button
      variant="ghost"
      size="icon-lg"
      onClick={toggle}
      // 현재 상태와 다음 동작을 함께 읽어준다 — 아이콘만으로는 순환 순서를 알 수 없다.
      // 조사를 붙이지 않는다: 라벨이 "시스템 설정"·"밝게"로 섞여 있어 받침 규칙이 갈린다
      aria-label={`화면 테마 — 현재 ${label}, 눌러서 ${META[theme === "dark" ? "light" : "dark"].label}`}
      className="fixed top-3 right-3 z-50 size-11 text-muted-foreground hover:text-foreground"
    >
      <Icon aria-hidden="true" className="size-5" />
    </Button>
  );
}
