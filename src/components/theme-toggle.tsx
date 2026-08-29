"use client";
// 테마 토글 — 시스템 → 라이트 → 다크 순환. globals.css의 color-scheme 하나만 바꾼다
// 시스템 상태는 data-theme 속성 자체를 지우는 것으로 표현한다 (light-dark()가 시스템을 따름)
import { useSyncExternalStore } from "react";
import { Moon, Sun, SunMoon } from "lucide-react";
import { Button } from "@/components/ui/button";

const ORDER = ["system", "light", "dark"] as const;
type Theme = (typeof ORDER)[number];

// 세 상태를 해·달 한 계열로 묶는다 — 모니터 아이콘은 "밝기"가 아니라 "기기"로 읽힌다
const META: Record<Theme, { icon: typeof Sun; label: string }> = {
  system: { icon: SunMoon, label: "시스템 설정" },
  light: { icon: Sun, label: "밝게" },
  dark: { icon: Moon, label: "어둡게" },
};

// 진실의 원천은 <html data-theme> 하나다 — 상태를 따로 들면 인라인 스크립트가 먼저 쓴 값과 갈라진다
let listeners: (() => void)[] = [];
const subscribe = (cb: () => void) => {
  listeners.push(cb);
  return () => { listeners = listeners.filter((l) => l !== cb); };
};
const read = () => (document.documentElement.dataset.theme as Theme) || "system";
// 서버는 사용자 선택을 모른다. 아이콘 한 개짜리 차이라 마운트 후 교체를 허용한다
const readServer = (): Theme => "system";

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, read, readServer);

  const cycle = () => {
    const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];
    const root = document.documentElement;
    if (next === "system") {
      delete root.dataset.theme;
      localStorage.removeItem("theme");
    } else {
      root.dataset.theme = next;
      localStorage.setItem("theme", next);
    }
    listeners.forEach((l) => l());
  };

  const { icon: Icon, label } = META[theme];
  return (
    <Button
      variant="ghost"
      size="icon-lg"
      onClick={cycle}
      // 현재 상태와 다음 동작을 함께 읽어준다 — 아이콘만으로는 순환 순서를 알 수 없다.
      // 조사를 붙이지 않는다: 라벨이 "시스템 설정"·"밝게"로 섞여 있어 받침 규칙이 갈린다
      aria-label={`화면 테마 — 현재 ${label}, 눌러서 ${META[ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length]].label}`}
      className="fixed top-3 right-3 z-50 size-11 text-muted-foreground hover:text-foreground"
    >
      <Icon aria-hidden="true" className="size-5" />
    </Button>
  );
}
