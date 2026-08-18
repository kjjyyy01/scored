// 테스트용 세션 로그 레코드 빌더 — 실 ~/.claude/projects JSONL 구조를 그대로 흉내
type Extra = Record<string, unknown>;

// user 프롬프트 (content 문자열)
export const user = (ts: string, text: string, extra: Extra = {}) =>
  JSON.stringify({ type: "user", timestamp: ts, uuid: "u-" + ts + text.length, message: { role: "user", content: text }, ...extra });

// tool_result만 담긴 user 레코드
export const toolResult = (ts: string, isError: boolean, extra: Extra = {}) =>
  JSON.stringify({ type: "user", timestamp: ts, uuid: "tr-" + ts, message: { role: "user", content: [{ type: "tool_result", tool_use_id: "t", content: "…", is_error: isError }] }, ...extra });

// assistant 레코드 (같은 message.id로 여러 줄 반복 가능)
export const assistant = (
  ts: string,
  id: string,
  o: { usage?: Partial<{ input_tokens: number; cache_creation_input_tokens: number; cache_read_input_tokens: number; output_tokens: number }>; model?: string; content?: unknown[]; text?: string; tools?: string[] } = {},
  extra: Extra = {},
) => {
  const content = o.content ?? [
    ...(o.text !== undefined ? [{ type: "text", text: o.text }] : []),
    ...(o.tools ?? []).map((name) => ({ type: "tool_use", id: "toolu_" + name, name, input: {} })),
  ];
  return JSON.stringify({ type: "assistant", timestamp: ts, uuid: "a-" + ts + id, message: { role: "assistant", id, model: o.model ?? "claude-fable-5", content, usage: { input_tokens: 0, output_tokens: 0, ...o.usage } }, ...extra });
};

// 파일 1개 = [파일명, 줄] 배열
export const file = (name: string, lines: string[]): [string, string][] => lines.map((l) => [name, l]);

export const SEOUL = "Asia/Seoul";
export const at = (s: string) => new Date(s);
