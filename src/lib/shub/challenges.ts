/**
 * Challenge engine — pure logic for public/private weekly/monthly challenges.
 */
export type ChallengeType = "workout" | "water" | "sleep" | "running" | "habits";
export type ChallengeScope = "public" | "private";
export type ChallengePeriod = "weekly" | "monthly";

export interface Challenge {
  id: string;
  title: string;
  type: ChallengeType;
  scope: ChallengeScope;
  period: ChallengePeriod;
  goal: number;          // target value (e.g. 5 workouts, 14000 ml water)
  xpReward: number;      // XP awarded on completion
  startsAt: string;      // ISO date
  endsAt: string;        // ISO date
}

export interface Participation {
  challengeId: string;
  userId: string;
  progress: number;
  completedAt?: string | null;
}

export function progressPct(p: Participation, c: Challenge): number {
  if (c.goal <= 0) return 0;
  return Math.min(100, Math.round((p.progress / c.goal) * 100));
}

export function isCompleted(p: Participation, c: Challenge): boolean {
  return p.progress >= c.goal;
}

export function daysRemaining(c: Challenge, now: Date = new Date()): number {
  const end = new Date(c.endsAt).getTime();
  return Math.max(0, Math.ceil((end - now.getTime()) / 86_400_000));
}

export function defaultXpFor(period: ChallengePeriod): number {
  return period === "weekly" ? 100 : 300;
}
