#!/usr/bin/env node
// bin 진입점 — 실제 환경(홈·시계·타임존·브라우저)을 main에 주입
import { homedir } from "node:os";
import { readFileSync } from "node:fs";
import { main } from "./main.ts";
import { openUrl } from "./open.ts";
import { systemTz } from "./time.ts";

const version = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")).version as string;
process.exitCode = await main(process.argv.slice(2), {
  home: homedir(),
  now: new Date(),
  tz: systemTz(),
  open: openUrl,
  out: (l) => console.log(l),
  err: (l) => console.error(l),
  version,
});
