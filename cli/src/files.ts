// ~/.claude/projects/**/*.jsonl 을 줄 단위 스트리밍으로 읽는다 (전체 메모리 적재 금지 — CLI-001 §8)
import { createReadStream } from "node:fs";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { createInterface } from "node:readline";
import type { Line } from "./analyze.ts";

// 하위 디렉터리 재귀 — 서브에이전트 트랜스크립트 포함. 루트 미존재 시 ENOENT throw (→ ERR-CLI-001). parentPath는 Node 20.12+, 구버전은 path
export async function listJsonl(root: string): Promise<string[]> {
  const out: string[] = [];
  const entries = await readdir(root, { withFileTypes: true, recursive: true });
  for (const e of entries) if (e.isFile() && e.name.endsWith(".jsonl")) out.push(join(e.parentPath ?? (e as { path?: string }).path ?? root, e.name));
  return out.sort();
}

export async function* readLines(files: string[]): AsyncGenerator<Line> {
  for (const file of files) {
    const rl = createInterface({ input: createReadStream(file, { encoding: "utf8" }), crlfDelay: Infinity });
    try {
      for await (const line of rl) yield [file, line];
    } catch {
      // 읽기 실패한 파일은 건너뛴다 (관대한 파싱)
    }
  }
}
