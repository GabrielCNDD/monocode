import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  isRemoteControlHarness,
  loadRemoteControl,
  saveRemoteControl,
} from "./remoteControl";

beforeEach(() => {
  const stored = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: vi.fn((key: string) => stored.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      stored.set(key, value);
    }),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("remote control setting", () => {
  it("is off until the user turns it on", () => {
    expect(loadRemoteControl("claude")).toBe(false);
    expect(loadRemoteControl("codex")).toBe(false);
  });

  it("keeps one switch per harness", () => {
    saveRemoteControl("claude", true);
    expect(loadRemoteControl("claude")).toBe(true);
    expect(loadRemoteControl("codex")).toBe(false);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "monocode.remoteControl.claude",
      "1",
    );

    saveRemoteControl("claude", false);
    expect(loadRemoteControl("claude")).toBe(false);
  });

  it("names the harnesses that have a Remote Control bridge", () => {
    expect(isRemoteControlHarness("claude")).toBe(true);
    expect(isRemoteControlHarness("codex")).toBe(true);
    expect(isRemoteControlHarness("cursor")).toBe(false);
    expect(isRemoteControlHarness("toString")).toBe(false);
  });
});
