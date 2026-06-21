import { createFileRoute } from "@tanstack/react-router";
import { ScoreRing } from "@/components/shub/ScoreRing";
import { LevelBadge } from "@/components/shub/LevelBadge";
import { Flame, Trophy, Zap, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/app/score")({
  component: ScorePage,
});

const weekly = [72, 78, 81, 75, 88, 84, 82];
const monthly = [68, 72, 75, 78, 80, 82, 81, 84, 85, 83, 88, 90];

const medals = [
  { name: "Streak 7d", tier: "bronze" as const, unlocked: true },
  { name: "Streak 30d", tier: "silver" as const, unlocked: true },
  { name: "100 treinos", tier: "gold" as const, unlocked: true },
  { name: "Elite 90+", tier: "elite" as const, unlocked: false },
];

function ScorePage() {
  return (
    <div className="px-5 pt-12">
      <header className="fade-up">
        <p className="text-[10px] uppercase tracking-[0.3em] text-neon">SHUB SCORE</p>
        <h1 className="mt-1 font-display text-3xl font-bold">Sua performance</h1>
        <p className="mt-1 text-sm text-muted-foreground">Evolução baseada em 5 pilares.</p>
      </header>

      <section className="mt-6 rounded-[28px] border border-neon/25 bg-surface p-6 fade-up">
        <div className="flex justify-center">
          <ScoreRing value={82} size={240} stroke={16} />
        </div>
        <div className="mt-5 flex items-center justify-center gap-3">
          <LevelBadge tier="gold" size="lg" />
          <span className="inline-flex items-center gap-1 rounded-full bg-neon/10 px-3 py-1 text-xs font-semibold text-neon">
            <Flame className="h-3 w-3" /> 18d streak
          </span>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3 text-center">
          <Stat icon={Zap} label="XP" value="4.820" />
          <Stat icon={Trophy} label="Rank" value="#127" />
          <Stat icon={TrendingUp} label="Δ semana" value="+8" />
        </div>
      </section>

      <SectionTitle>Histórico semanal</SectionTitle>
      <Chart data={weekly} labels={["S", "T", "Q", "Q", "S", "S", "D"]} />

      <SectionTitle>Histórico mensal</SectionTitle>
      <Chart data={monthly} />

      <SectionTitle>Medalhas</SectionTitle>
      <div className="mt-3 grid grid-cols-2 gap-3 pb-10">
        {medals.map((m) => (
          <div
            key={m.name}
            className={`card-premium p-4 ${m.unlocked ? "" : "opacity-40"} flex flex-col items-center gap-2`}
          >
            <LevelBadge tier={m.tier} size="sm" />
            <p className="text-xs font-semibold">{m.name}</p>
            <p className="text-[10px] text-muted-foreground">{m.unlocked ? "Conquistada" : "Bloqueada"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-8 font-display text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">{children}</h2>;
}

function Stat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-elevated/60 p-3">
      <Icon className="mx-auto h-4 w-4 text-neon" />
      <p className="mt-1 font-display text-base font-bold">{value}</p>
      <p className="text-[9px] uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}

function Chart({ data, labels }: { data: number[]; labels?: string[] }) {
  const max = Math.max(...data);
  return (
    <div className="mt-3 rounded-2xl border border-border bg-surface p-4">
      <div className="flex h-32 items-end gap-1.5">
        {data.map((v, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-neon/40 to-neon"
              style={{ height: `${(v / max) * 100}%`, boxShadow: "0 0 12px rgba(183,255,0,0.3)" }}
            />
            {labels && <span className="text-[9px] text-muted-foreground">{labels[i]}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
