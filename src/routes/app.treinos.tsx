import { createFileRoute } from "@tanstack/react-router";
import { Play, Clock, Flame } from "lucide-react";

export const Route = createFileRoute("/app/treinos")({
  component: Treinos,
});

const programs = [
  { name: "Push Power A", focus: "Peito · Ombro · Tríceps", time: "55 min", kcal: 480, today: true },
  { name: "Pull Strength B", focus: "Costas · Bíceps", time: "50 min", kcal: 420 },
  { name: "Legs Hypertrophy", focus: "Pernas · Glúteos", time: "65 min", kcal: 560 },
  { name: "Mobilidade ativa", focus: "Recuperação", time: "20 min", kcal: 110 },
];

function Treinos() {
  return (
    <div className="px-5 pt-12">
      <h1 className="font-display text-2xl font-bold">Treinos</h1>
      <p className="text-sm text-muted-foreground">Seu plano semanal SHUB.</p>

      <div className="mt-6 overflow-hidden rounded-3xl border border-neon/30 bg-surface">
        <div className="relative p-6">
          <div className="pointer-events-none absolute -top-16 -right-10 h-48 w-48 rounded-full bg-neon/20 blur-3xl" />
          <p className="text-[10px] uppercase tracking-widest text-neon">Treino de hoje</p>
          <h2 className="mt-1 font-display text-2xl font-bold">Push Power A</h2>
          <p className="text-xs text-muted-foreground">8 exercícios · intensidade alta</p>

          <div className="mt-4 flex gap-4 text-xs">
            <div className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-neon" /> 55 min</div>
            <div className="flex items-center gap-1.5"><Flame className="h-4 w-4 text-neon" /> 480 kcal</div>
          </div>

          <button className="mt-5 inline-flex items-center gap-2 rounded-full bg-neon px-5 py-3 text-sm font-semibold text-neon-foreground glow-neon active:scale-95 transition">
            <Play className="h-4 w-4 fill-current" /> Iniciar treino
          </button>
        </div>
      </div>

      <h2 className="mt-8 font-display text-base font-semibold">Sua semana</h2>
      <div className="mt-3 space-y-3">
        {programs.map((p) => (
          <div key={p.name} className={`flex items-center gap-4 rounded-2xl border bg-surface p-4 ${p.today ? "border-neon/40" : "border-border"}`}>
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-surface-elevated text-neon">
              <Play className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">{p.name}</p>
              <p className="text-[11px] text-muted-foreground">{p.focus}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-neon">{p.time}</p>
              <p className="text-[11px] text-muted-foreground">{p.kcal} kcal</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
