/**
 * Catálogo de medalhas SHUB LIFE
 */

export type Rarity = "common" | "rare" | "epic" | "legendary" | "elite";

export interface BadgeDef {
  code: string;
  name: string;
  description: string;
  rarity: Rarity;
  /** condição que retorna true quando ganha */
  check: (ctx: BadgeContext) => boolean;
}

export interface BadgeContext {
  workoutsCompleted: number;
  currentStreak: number;
  bestStreak: number;
  challengesCompleted: number;
}

export const BADGES: BadgeDef[] = [
  {
    code: "first_workout",
    name: "Primeiro Treino",
    description: "Você concluiu seu primeiro treino.",
    rarity: "common",
    check: (c) => c.workoutsCompleted >= 1,
  },
  {
    code: "streak_7",
    name: "7 Dias de Fogo",
    description: "7 dias consecutivos de evolução.",
    rarity: "rare",
    check: (c) => c.bestStreak >= 7,
  },
  {
    code: "streak_30",
    name: "Disciplinado",
    description: "30 dias consecutivos.",
    rarity: "epic",
    check: (c) => c.bestStreak >= 30,
  },
  {
    code: "streak_90",
    name: "Inquebrável",
    description: "90 dias consecutivos.",
    rarity: "legendary",
    check: (c) => c.bestStreak >= 90,
  },
  {
    code: "streak_365",
    name: "Lendário",
    description: "1 ano consecutivo. Elite mundial.",
    rarity: "elite",
    check: (c) => c.bestStreak >= 365,
  },
  {
    code: "workouts_100",
    name: "Centurião",
    description: "100 treinos concluídos.",
    rarity: "rare",
    check: (c) => c.workoutsCompleted >= 100,
  },
  {
    code: "workouts_500",
    name: "Veterano",
    description: "500 treinos concluídos.",
    rarity: "epic",
    check: (c) => c.workoutsCompleted >= 500,
  },
  {
    code: "workouts_1000",
    name: "Mestre",
    description: "1000 treinos. Status de mestre.",
    rarity: "legendary",
    check: (c) => c.workoutsCompleted >= 1000,
  },
];

export function evaluateBadges(ctx: BadgeContext): BadgeDef[] {
  return BADGES.filter((b) => b.check(ctx));
}

export const RARITY_COLOR: Record<Rarity, string> = {
  common: "text-zinc-300",
  rare: "text-sky-400",
  epic: "text-fuchsia-400",
  legendary: "text-amber-400",
  elite: "text-primary",
};
