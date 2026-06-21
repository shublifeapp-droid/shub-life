import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Building2, Users, User } from "lucide-react";

export const Route = createFileRoute("/app/rankings")({
  component: RankingsPage,
});

const tabs = [
  { id: "cidade", label: "Cidade", icon: MapPin },
  { id: "academia", label: "Academia", icon: Building2 },
  { id: "grupos", label: "Grupos", icon: Users },
  { id: "personais", label: "Personais", icon: User },
] as const;

const data: Record<string, { name: string; meta: string; score: number }[]> = {
  cidade: [
    { name: "Marina S.", meta: "São Paulo", score: 94 },
    { name: "Rafael T.", meta: "São Paulo", score: 91 },
    { name: "Você", meta: "São Paulo", score: 82 },
    { name: "Carla M.", meta: "São Paulo", score: 80 },
  ],
  academia: [
    { name: "Pedro L.", meta: "SmartFit Paulista", score: 96 },
    { name: "Você", meta: "SmartFit Paulista", score: 82 },
    { name: "Ana V.", meta: "SmartFit Paulista", score: 78 },
  ],
  grupos: [
    { name: "Squad Alpha", meta: "12 membros", score: 88 },
    { name: "Time Beta", meta: "8 membros", score: 84 },
  ],
  personais: [
    { name: "Lucas Oliveira", meta: "32 alunos ativos", score: 92 },
    { name: "Bianca Reis", meta: "28 alunos ativos", score: 89 },
  ],
};

function RankingsPage() {
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("cidade");
  const rows = data[active];

  return (
    <div className="px-5 pt-12 pb-10">
      <header className="fade-up">
        <p className="text-[10px] uppercase tracking-[0.3em] text-neon">RANKINGS</p>
        <h1 className="mt-1 font-display text-3xl font-bold">Top performers</h1>
      </header>

      <div className="mt-5 grid grid-cols-4 gap-2">
        {tabs.map((t) => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`flex flex-col items-center gap-1 rounded-2xl border px-2 py-3 text-[10px] font-semibold uppercase tracking-wider transition ${
                isActive ? "border-neon bg-neon/10 text-neon" : "border-border bg-surface text-muted-foreground"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5 card-premium overflow-hidden">
        {rows.map((r, i) => {
          const me = r.name === "Você";
          return (
            <div
              key={i}
              className={`flex items-center justify-between border-b border-border px-4 py-3 last:border-0 ${
                me ? "bg-neon/5" : ""
              }`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold ${
                    i === 0 ? "bg-tier-gold text-background" : i === 1 ? "bg-tier-silver text-background" : i === 2 ? "bg-tier-bronze text-background" : "bg-secondary"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className={`truncate text-sm ${me ? "font-bold text-neon" : "font-medium"}`}>{r.name}</p>
                  <p className="truncate text-[10px] text-muted-foreground">{r.meta}</p>
                </div>
              </div>
              <span className="font-display text-lg font-bold text-neon">{r.score}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
