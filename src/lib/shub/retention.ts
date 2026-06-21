/**
 * Retention engine — daily hook messages combining streak, score, and goals.
 */
export interface RetentionContext {
  hour: number;                // 0-23 local
  streakDays: number;
  scoreToday?: number;         // 0-100, optional if not computed yet
  workoutDone: boolean;
  waterGoalMet: boolean;
}

export function dailyHook(ctx: RetentionContext): string {
  if (!ctx.workoutDone && ctx.hour >= 18) return "Ainda dá tempo do treino de hoje. Bora?";
  if (!ctx.waterGoalMet && ctx.hour >= 15) return "Hidratação em dia? Faltam alguns goles.";
  if (ctx.streakDays >= 7) return `🔥 ${ctx.streakDays} dias seguidos. Não quebre agora.`;
  if (typeof ctx.scoreToday === "number" && ctx.scoreToday >= 80) return "Score top hoje. Mantém o ritmo.";
  if (ctx.hour < 10) return "Bom dia. Comece o dia somando pontos.";
  return "Muito além do treino. Evolua hoje.";
}
