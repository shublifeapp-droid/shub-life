/**
 * Notification engine — typed notification factory.
 */
export type NotificationKind =
  | "workout_today"
  | "water_goal"
  | "achievement"
  | "new_badge"
  | "new_challenge"
  | "new_comment"
  | "commission_received"
  | "payment_approved"
  | "streak_at_risk";

export interface AppNotification {
  kind: NotificationKind;
  title: string;
  body: string;
  href?: string;
  meta?: Record<string, unknown>;
}

const COPY: Record<NotificationKind, { title: string; body: (m?: Record<string, unknown>) => string; href?: string }> = {
  workout_today:        { title: "Treino do dia",         body: () => "Bora? Seu treino de hoje está pronto.", href: "/app/treinos" },
  water_goal:           { title: "Meta de água",          body: () => "Faltam alguns goles para bater sua meta.", href: "/app" },
  achievement:          { title: "Nova conquista!",       body: (m) => `Você desbloqueou: ${m?.title ?? "uma conquista"}.`, href: "/app/score" },
  new_badge:            { title: "Nova medalha",          body: (m) => `Medalha conquistada: ${m?.title ?? "—"}.`, href: "/app/score" },
  new_challenge:        { title: "Novo desafio",          body: (m) => `${m?.title ?? "Um novo desafio"} começou.`, href: "/app/desafios" },
  new_comment:          { title: "Novo comentário",       body: (m) => `${m?.author ?? "Alguém"} comentou no seu post.`, href: "/app" },
  commission_received:  { title: "Comissão recebida",     body: (m) => `+R$ ${(m?.amount ?? 0)} na sua carteira.`, href: "/app/assinatura" },
  payment_approved:     { title: "Pagamento aprovado",    body: () => "Seu plano premium está ativo.", href: "/app/assinatura" },
  streak_at_risk:       { title: "Seu streak está em risco!", body: (m) => `Não perca os ${m?.days ?? 0} dias seguidos.`, href: "/app" },
};

export function buildNotification(kind: NotificationKind, meta?: Record<string, unknown>): AppNotification {
  const c = COPY[kind];
  return { kind, title: c.title, body: c.body(meta), href: c.href, meta };
}
