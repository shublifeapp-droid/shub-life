/**
 * Cálculo de streak (dias consecutivos)
 */

export interface StreakState {
  current: number;
  best: number;
  lastActivity: Date | null;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function diffDays(a: Date, b: Date): number {
  const da = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const db = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return Math.round((da - db) / DAY_MS);
}

export function updateStreak(state: StreakState, today: Date = new Date()): StreakState {
  if (!state.lastActivity) {
    return { current: 1, best: Math.max(1, state.best), lastActivity: today };
  }
  const delta = diffDays(today, state.lastActivity);
  if (delta === 0) return state;
  const current = delta === 1 ? state.current + 1 : 1;
  return {
    current,
    best: Math.max(state.best, current),
    lastActivity: today,
  };
}

export function streakMessage(current: number): string {
  if (current >= 365) return "1 ano de evolução. Lendário.";
  if (current >= 90) return "90 dias firmes. Disciplina de elite.";
  if (current >= 30) return "30 dias sem falhar. Você é outro.";
  if (current >= 7) return "Uma semana inteira. Mantém o fogo.";
  if (current >= 3) return "3 dias. O hábito está nascendo.";
  if (current >= 1) return "Começou. Não pare amanhã.";
  return "Hora de começar uma nova sequência.";
}
