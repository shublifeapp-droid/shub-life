import { createFileRoute } from "@tanstack/react-router";
import { Flame, Trophy, Target, Users } from "lucide-react";

export const Route = createFileRoute("/app/desafios")({
  component: DesafiosPage,
});

const active = [
  { title: "30 dias sem faltar", icon: Flame, progress: 60, days: "18/30", reward: "500 XP + Medalha Gold" },
  { title: "Maratona da semana", icon: Target, progress: 75, days: "5/7 dias", reward: "Badge Elite" },
  { title: "10k passos diários", icon: Trophy, progress: 40, days: "4/10 dias", reward: "300 XP" },
];

const ranking = [
  { pos: 1, name: "Marina S.", xp: 8420 },
  { pos: 2, name: "Você", xp: 7180, me: true },
  { pos: 3, name: "Rafael T.", xp: 6940 },
  { pos: 4, name: "João P.", xp: 5210 },
  { pos: 5, name: "Carla M.", xp: 4980 },
];

function DesafiosPage() {
  return (
    <div className="px-5 pt-12 pb-10">
      <header className="fade-up">
        <p className="text-[10px] uppercase tracking-[0.3em] text-neon">DESAFIOS</p>
        <h1 className="mt-1 font-display text-3xl font-bold">Supere seus limites</h1>
      </header>

      <section className="mt-6 space-y-3">
        {active.map((c) => (
          <div key={c.title} className="card-premium p-4 fade-up">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-neon/10 text-neon">
                <c.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{c.title}</p>
                <p className="text-xs text-muted-foreground">{c.reward}</p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-neon transition-all duration-700"
                      style={{ width: `${c.progress}%`, boxShadow: "0 0 8px var(--neon)" }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-neon">{c.days}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      <h2 className="mt-8 flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        <Users className="h-4 w-4" /> Ranking do desafio
      </h2>

      <div className="mt-3 card-premium overflow-hidden">
        {ranking.map((r) => (
          <div
            key={r.pos}
            className={`flex items-center justify-between border-b border-border px-4 py-3 last:border-0 ${
              r.me ? "bg-neon/5" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${
                  r.pos === 1 ? "bg-tier-gold text-background" : r.pos === 2 ? "bg-tier-silver text-background" : r.pos === 3 ? "bg-tier-bronze text-background" : "bg-secondary text-foreground"
                }`}
              >
                {r.pos}
              </span>
              <span className={`text-sm ${r.me ? "font-bold text-neon" : "font-medium"}`}>{r.name}</span>
            </div>
            <span className="text-sm font-semibold">{r.xp.toLocaleString("pt-BR")} XP</span>
          </div>
        ))}
      </div>
    </div>
  );
}
