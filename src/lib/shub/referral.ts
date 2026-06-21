/**
 * Influencer referral helpers — code generation, link building, and
 * client-side persistence of the captured ref code until signup.
 */
const KEY = "shub_ref_code";

export function referralLink(origin: string, code: string): string {
  return `${origin.replace(/\/$/, "")}/r/${code}`;
}

export function saveRefCode(code: string): void {
  try {
    localStorage.setItem(KEY, code.toUpperCase());
  } catch {
    /* noop */
  }
}

export function readRefCode(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function clearRefCode(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* noop */
  }
}

export function generateInfluencerCode(seed: string): string {
  const base = seed.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${base.slice(0, 6) || "SHUB"}${rand}`;
}
