import { createFileRoute } from "@tanstack/react-router";
import { Trophy, Flame, MessageCircle, Sparkles, Bell } from "lucide-react";

export const Route = createFileRoute("/app/notificacoes")({
  component: NotificacoesPage,
});

const items = [
  { icon: Trophy, title: "Nova conquista!", desc: "Você desbloqueou a medalha Streak 30d", time: "agora", neon: true },
  { icon: Flame, title: "Streak em risco", desc: "Faltam 4h para manter sua sequência de 18 dias.", time: "2h" },
  { icon: MessageCircle, title: "Marina comentou", desc: "\"Bora junto na maratona da semana? 🔥\"", time: "5h" },
  { icon: Sparkles, title: "Novidade", desc: "Novo desafio disponível: 10k passos diários.", time: "ontem" },
  { icon: Bell, title: "Lembrete", desc: "Treino agendado para hoje às 19h.", time: "ontem" },
];

function NotificacoesPage() {
  return (
    <div className="px-5 pt-12 pb-10">
      <header className="fade-up">
        <p className="text-[10px] uppercase tracking-[0.3em] text-neon">NOTIFICAÇÕES</p>
        <h1 className="mt-1 font-display text-3xl font-bold">Sua central</h1>
      </header>

      <div className="mt-6 space-y-2">
        {items.map((it, i) => (
          <div
            key={i}
            className={`card-premium flex items-start gap-3 p-4 fade-up ${it.neon ? "ring-neon" : ""}`}
          >
            <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${it.neon ? "bg-neon text-neon-foreground" : "bg-neon/10 text-neon"}`}>
              <it.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-semibold">{it.title}</p>
                <span className="shrink-0 text-[10px] text-muted-foreground">{it.time}</span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{it.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
