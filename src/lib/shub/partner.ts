/**
 * SHUB Partner engine — referral codes, links, QR, recurring commission.
 */
export const PARTNER_COMMISSION_RATE = 0.10; // 10% recurring, lifetime

export function partnerCode(userId: string): string {
  // Deterministic 6-char code from uuid (no external deps).
  const hex = userId.replace(/-/g, "");
  let n = 0;
  for (let i = 0; i < hex.length; i++) n = (n * 31 + hex.charCodeAt(i)) >>> 0;
  return n.toString(36).toUpperCase().padStart(6, "0").slice(-6);
}

export function partnerLink(origin: string, code: string): string {
  return `${origin.replace(/\/$/, "")}/r/${code}`;
}

export function qrCodeUrl(link: string, size = 256): string {
  // Public QR service — no auth required, safe for client rendering.
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(link)}`;
}

/** Monthly commission for one active premium student. */
export function commissionFor(premiumPriceBrl: number): number {
  return Math.round(premiumPriceBrl * PARTNER_COMMISSION_RATE * 100) / 100;
}

export interface PartnerStats {
  studentsCount: number;
  activePremiumCount: number;
  currentBalance: number;
  totalEarned: number;
}
