/**
 * SHUB SCORE — núcleo da gamificação
 * Pontuação diária 0-100 com pesos por pilar.
 */

export const SCORE_WEIGHTS = {
  workout: 0.4,
  sleep: 0.2,
  water: 0.15,
  mood: 0.1,
  discipline: 0.15,
} as const;

export interface PillarInputs {
  /** 0-100: % de treinos planejados concluídos no dia */
  workout: number;
  /** horas dormidas (meta 8h) */
  sleepHours: number;
  /** ml consumidos (meta 2500ml) */
  waterMl: number;
  /** humor 1-5 */
  mood: number;
  /** streak atual em dias */
  streak: number;
}

export interface ScoreBreakdown {
  workout: number;
  sleep: number;
  water: number;
  mood: number;
  discipline: number;
  total: number;
}

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, n));

export function calculateShubScore(input: PillarInputs): ScoreBreakdown {
  const workout = clamp(input.workout);
  const sleep = clamp((input.sleepHours / 8) * 100);
  const water = clamp((input.waterMl / 2500) * 100);
  const mood = clamp(((input.mood - 1) / 4) * 100);
  // disciplina cresce com streak — satura em 30 dias
  const discipline = clamp((Math.min(input.streak, 30) / 30) * 100);

  const total = Math.round(
    workout * SCORE_WEIGHTS.workout +
      sleep * SCORE_WEIGHTS.sleep +
      water * SCORE_WEIGHTS.water +
      mood * SCORE_WEIGHTS.mood +
      discipline * SCORE_WEIGHTS.discipline,
  );

  return {
    workout: Math.round(workout),
    sleep: Math.round(sleep),
    water: Math.round(water),
    mood: Math.round(mood),
    discipline: Math.round(discipline),
    total: clamp(total),
  };
}

export type Trend = "up" | "stable" | "down";

export function detectTrend(history: number[], window = 7): Trend {
  if (history.length < 2) return "stable";
  const recent = history.slice(-window);
  const half = Math.floor(recent.length / 2);
  if (half === 0) return "stable";
  const prevAvg = avg(recent.slice(0, half));
  const currAvg = avg(recent.slice(-half));
  const diff = currAvg - prevAvg;
  if (diff > 3) return "up";
  if (diff < -3) return "down";
  return "stable";
}

export function aggregateAverage(scores: number[]): number {
  return scores.length ? Math.round(avg(scores)) : 0;
}

function avg(arr: number[]): number {
  return arr.reduce((s, n) => s + n, 0) / arr.length;
}

/** Mensagens motivacionais baseadas em score + tendência */
export function motivationalMessage(score: number, trend: Trend): string {
  if (trend === "up" && score >= 80) return "Você está evoluindo. Mantenha o ritmo.";
  if (trend === "up") return "Seu progresso está acelerando. Continue assim.";
  if (trend === "down" && score < 50) return "Bora retomar. Um passo de cada vez.";
  if (trend === "down") return "Pequenos ajustes hoje fazem grande diferença amanhã.";
  if (score >= 90) return "Performance de elite. Você está no topo.";
  if (score >= 70) return "Consistência forte. Siga firme.";
  if (score >= 50) return "Você está no caminho. Continue.";
  return "Cada dia conta. Comece agora.";
}
