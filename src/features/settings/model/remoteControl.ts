import { flagStore } from "./displayPrefs";

/**
 * Remote Control: the agent's own bridge from the running CLI process to its
 * web and phone apps (claude.ai/code for Claude Code, the Codex app for Codex).
 * A session is reachable there only while its process runs, so the harness
 * registry keeps Remote Control sessions alive instead of parking them.
 */
export type RemoteControlHarness = "claude" | "codex";

export const REMOTE_CONTROL_HARNESSES: readonly RemoteControlHarness[] = [
  "claude",
  "codex",
];

export const REMOTE_CONTROL_DEFAULT = false;

/** Fired on `window` whenever a Remote Control switch flips (detail: boolean). */
export const REMOTE_CONTROL_CHANGE_EVENT = "monocode:remotecontrolchange";

const stores = {
  claude: flagStore(
    "monocode.remoteControl.claude",
    REMOTE_CONTROL_DEFAULT,
    `${REMOTE_CONTROL_CHANGE_EVENT}:claude`,
  ),
  codex: flagStore(
    "monocode.remoteControl.codex",
    REMOTE_CONTROL_DEFAULT,
    `${REMOTE_CONTROL_CHANGE_EVENT}:codex`,
  ),
} as const;

export function isRemoteControlHarness(
  harness: string,
): harness is RemoteControlHarness {
  return REMOTE_CONTROL_HARNESSES.includes(harness as RemoteControlHarness);
}

export function loadRemoteControl(harness: RemoteControlHarness): boolean {
  return stores[harness].load();
}

export function saveRemoteControl(
  harness: RemoteControlHarness,
  value: boolean,
): void {
  stores[harness].save(value);
}

/** React hook: the current switch for one harness, re-rendering on change. */
export function useRemoteControl(harness: RemoteControlHarness): boolean {
  return stores[harness].useFlag();
}
