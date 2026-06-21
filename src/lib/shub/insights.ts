/**
 * Smart Insights engine — generates motivational, data-driven messages.
 */
export interface InsightInput {
  scoreThisWeek: number;        // 0-100
  scoreLastWeek: number;        // 0-100
  sleepAvgHoursThisWeek: number;
  sleepAvgHoursLastWeek: number;
  consecutiveActiveDays: number;
  scoreVsAverage: number;       // delta vs cohort avg (-100..+100)
}

export interface Insight {
  id: string;
  message: string;
  tone: "positive" | "neutral" | "warning";
}

export function generateInsights(input: InsightInput): Insight[] {
  const out: Insight[] = [];
  const delta = input.scoreThisWeek - input.scoreLastWeek;
  if (input.scoreLastWeek > 0 && delta !== 0) {
    const pct = Math.round((delta / Math.max(1, input.scoreLastWeek)) * 100);
    out.push({
      id: "score_trend",
      tone: pct > 0 ? "positive" : "warning",
      message: pct > 0
        ? `Você evoluiu ${pct}% esta semana. Continue assim.`
        : `Seu score caiu ${Math.abs(pct)}% esta semana. Hora de retomar.`,
    });
  }

  const sleepDelta = input.sleepAvgHoursThisWeek - input.sleepAvgHoursLastWeek;
  if (Math.abs(sleepDelta) >= 0.3) {
    out.push({
      id: "sleep_trend",
      tone: sleepDelta > 0 ? "positive" : "warning",
      message: sleepDelta > 0
        ? "Seu sono melhorou. Reflete direto no seu SHUB SCORE."
        : "Seu sono piorou. Tente dormir 30 min mais cedo hoje.",
    });
  }

  if (input.consecutiveActiveDays >= 7) {
    out.push({
      id: "streak",
      tone: "positive",
      message: `Você está há ${input.consecutiveActiveDays} dias consecutivos evoluindo.`,
    });
  }

  if (input.scoreVsAverage >= 10) {
    out.push({
      id: "above_avg",
      tone: "positive",
      message: "Seu SHUB SCORE está acima da média. Você está no caminho certo.",
    });
  } else if (input.scoreVsAverage <= -10) {
    out.push({
      id: "below_avg",
      tone: "neutral",
      message: "Pequenos hábitos diários elevam seu SHUB SCORE rapidamente.",
    });
  }

  if (out.length === 0) {
    out.push({ id: "default", tone: "neutral", message: "Constância é o segredo. Continue assim." });
  }
  return out;
}
