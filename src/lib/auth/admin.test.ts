// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { isAdminEmail } from "@/lib/auth/admin";

vi.mock("@/lib/auth/server", () => ({ auth: {} }));

describe("isAdminEmail", () => {
  const list = "Boss@Example.mn, staff@example.mn";

  it("matches listed emails case-insensitively", () => {
    expect(isAdminEmail("boss@example.mn", list)).toBe(true);
    expect(isAdminEmail("STAFF@example.mn", list)).toBe(true);
  });

  it("rejects everyone else", () => {
    expect(isAdminEmail("other@example.mn", list)).toBe(false);
    expect(isAdminEmail("boss@example.mn.evil.com", list)).toBe(false);
    expect(isAdminEmail("", list)).toBe(false);
    expect(isAdminEmail(null, list)).toBe(false);
  });

  it("nobody is admin when the list is empty", () => {
    expect(isAdminEmail("boss@example.mn", "")).toBe(false);
    expect(isAdminEmail("boss@example.mn", " , ")).toBe(false);
  });
});
