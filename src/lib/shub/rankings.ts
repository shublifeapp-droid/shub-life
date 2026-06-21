/**
 * Ranking engine — pure ordering helpers for leaderboards.
 */
export type RankingScope = "city" | "gym" | "group" | "user" | "personal";

export interface RankingEntry {
  userId: string;
  name: string;
  avatarUrl?: string | null;
  score: number;
}

export interface RankedEntry extends RankingEntry {
  position: number;
  isTop3: boolean;
}

/** Sorts descending by score and assigns dense positions (ties share a rank). */
export function rankEntries(entries: RankingEntry[]): RankedEntry[] {
  const sorted = [...entries].sort((a, b) => b.score - a.score);
  let lastScore = Number.POSITIVE_INFINITY;
  let lastPos = 0;
  return sorted.map((e, i) => {
    const position = e.score === lastScore ? lastPos : i + 1;
    lastScore = e.score;
    lastPos = position;
    return { ...e, position, isTop3: position <= 3 };
  });
}

export function podium(entries: RankedEntry[]): RankedEntry[] {
  return entries.filter((e) => e.isTop3).slice(0, 3);
}

export function userPosition(entries: RankedEntry[], userId: string): RankedEntry | null {
  return entries.find((e) => e.userId === userId) ?? null;
}
