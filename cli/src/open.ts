// 기본 브라우저로 URL 열기 — 플랫폼별 명령 (CLI-001 §5). cmd `start` 금지(8,191자 상한)
import { spawn } from "node:child_process";

export function openUrl(url: string, platform: NodeJS.Platform = process.platform): Promise<void> {
  const [cmd, args] =
    platform === "darwin" ? ["open", [url]]
    : platform === "win32" ? ["powershell", ["-NoProfile", "-Command", `Start-Process '${url}'`]]
    : ["xdg-open", [url]];
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: "ignore" });
    child.on("error", reject); // 명령 부재(ENOENT) 등
    child.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exit ${code}`))));
  });
}
