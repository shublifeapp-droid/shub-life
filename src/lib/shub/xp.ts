/**
 * Sistema de XP e níveis SHUB LIFE
 */

export const XP_REWARDS = {
  workoutCompleted: 50,
  waterGoalMet: 20,
  sleepOver7h: 30,
  challengeCompleted: 100,
  streak7Days: 200,
  moodLogged: 5,
  postCreated: 10,
} as const;

export type XPEvent = keyof typeof XP_REWARDS;

export type LevelTier = "bronze" | "silver" | "gold" | "elite";

export interface LevelInfo {
  tier: LevelTier;
  label: string;
  min: number;
  max: number;
  progressPercent: number;
  xpToNext: number;
}

const TIERS: Array<{ tier: LevelTier; label: string; min: number; max: number }> = [
  { tier: "bronze", label: "Bronze", min: 0, max: 999 },
  { tier: "silver", label: "Silver", min: 1000, max: 4999 },
  { tier: "gold", label: "Gold", min: 5000, max: 14999 },
  { tier: "elite", label: "Elite", min: 15000, max: Number.POSITIVE_INFINITY },
];

export function getLevel(xp: number): LevelInfo {
  const safe = Math.max(0, Math.floor(xp));
  const tier = TIERS.find((t) => safe >= t.min && safe <= t.max) ?? TIERS[0];
  const span = tier.max === Number.POSITIVE_INFINITY ? safe - tier.min || 1 : tier.max - tier.min;
  const intoTier = safe - tier.min;
  const progressPercent =
    tier.max === Number.POSITIVE_INFINITY ? 100 : Math.round((intoTier / span) * 100);
  const xpToNext = tier.max === Number.POSITIVE_INFINITY ? 0 : tier.max + 1 - safe;
  return {
    tier: tier.tier,
    label: tier.label,
    min: tier.min,
    max: tier.max,
    progressPercent,
    xpToNext,
  };
}

export function xpForEvent(event: XPEvent): number {
  return XP_REWARDS[event];
}
