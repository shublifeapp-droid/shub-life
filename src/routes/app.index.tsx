import { createFileRoute } from "@tanstack/react-router";
import { Bell, Dumbbell, Droplets, Moon, Smile, Apple, Flame, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/app/")({
  component: HomeScreen,
});

function HomeScreen() {
  const score = 87;
  return (
    <div className="px-5 pt-12">
      {/* Header */}
      <div className="flex items-center justify-between fade-up">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Bom dia</p>
          <h1 className="font-display text-2xl font-bold">Lucas <span className="text-neon">⚡</span></h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface">
            <Bell className="h-4 w-4" />
          </button>
          <div className="grid h-10 w-10 place-items-center rounded-full border border-neon/40 bg-surface-elevated text-xs font-bold">
            LS
          </div>
        </div>
      </div>

      {/* SHUB SCORE */}
      <div className="relative mt-6 overflow-hidden rounded-3xl border border-neon/20 bg-surface p-6 fade-up">
        <div className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-neon/20 blur-3xl" />
        <div className="relative flex items-center gap-5">
          <ScoreRing value={score} />
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">SHUB SCORE</p>
            <p className="font-display text-4xl font-bold leading-none">
              {score}<span className="text-base text-muted-foreground">/100</span>
            </p>
            <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-neon/40 bg-neon/10 px-2 py-0.5 text-[10px] font-semibold text-neon">
              <Flame className="h-3 w-3" /> +6 hoje
            </div>
          </div>
        </div>
        <p className="relative mt-4 text-xs leading-relaxed text-muted-foreground">
          Sua performance está em alto nível. Continue focado no sono e hidratação.
        </p>
      </div>

      {/* Stat cards */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <StatCard icon={Dumbbell} label="Treino do dia" value="Push A" sub="55 min · Peito + Tríceps" accent />
        <StatCard icon={Droplets} label="Água" value="1.8 L" sub="meta 3.0 L" progress={60} />
        <StatCard icon={Moon} label="Sono" value="7h 42m" sub="qualidade 92%" progress={92} />
        <StatCard icon={Smile} label="Humor" value="Foco" sub="energia alta" />
        <StatCard icon={Apple} label="Alimentação" value="1.840 kcal" sub="meta 2.400" progress={76} className="col-span-2" />
      </div>

      {/* Daily evolution bar */}
      <div className="mt-6 rounded-3xl border border-border bg-surface p-5 fade-up">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Evolução diária</p>
            <p className="mt-1 font-display text-xl font-bold">76% completo</p>
          </div>
          <span className="text-xs text-neon">7/9 metas</span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-elevated">
          <div className="h-full rounded-full bg-neon glow-neon" style={{ width: "76%" }} />
        </div>
        <div className="mt-3 flex justify-between text-[10px] text-muted-foreground">
          <span>00h</span><span>12h</span><span>agora</span><span>24h</span>
        </div>
      </div>

      {/* Weekly challenges */}
      <div className="mt-6">
        <SectionHeader title="Desafios da semana" action="Ver todos" />
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 [scrollbar-width:none]">
          <Challenge title="7 dias seguidos de treino" progress={5} total={7} />
          <Challenge title="Dormir 8h por 5 noites" progress={3} total={5} />
          <Challenge title="3L de água diariamente" progress={4} total={7} />
        </div>
      </div>

      {/* Recent activities */}
      <div className="mt-6">
        <SectionHeader title="Atividades recentes" action="Histórico" />
        <div className="mt-3 space-y-2">
          <Activity icon={Dumbbell} title="Treino Pull B" time="Ontem · 18:42" value="62 min" />
          <Activity icon={Moon} title="Sono profundo" time="Esta noite" value="2h 14m" />
          <Activity icon={Droplets} title="Hidratação ativada" time="08:10" value="+500 ml" />
        </div>
      </div>

      <p className="mt-8 text-center text-[10px] tracking-[0.3em] text-muted-foreground">
        SHUB LIFE · MUITO ALÉM DO TREINO
      </p>
    </div>
  );
}

function ScoreRing({ value }: { value: number }) {
  const r = 38;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative grid h-24 w-24 place-items-center">
      <svg width="96" height="96" className="-rotate-90">
        <circle cx="48" cy="48" r={r} stroke="var(--surface-elevated)" strokeWidth="8" fill="none" />
        <circle
          cx="48" cy="48" r={r}
          stroke="var(--neon)" strokeWidth="8" fill="none" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          style={{ filter: "drop-shadow(0 0 6px var(--neon))" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="font-display text-xl font-bold">{value}</span>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon, label, value, sub, progress, accent, className = "",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; value: string; sub?: string; progress?: number; accent?: boolean; className?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border bg-surface p-4 ${accent ? "border-neon/40 ring-neon" : "border-border"} ${className}`}>
      <div className="flex items-center justify-between">
        <div className={`grid h-8 w-8 place-items-center rounded-xl ${accent ? "bg-neon text-neon-foreground" : "bg-surface-elevated text-neon"}`}>
          <Icon className="h-4 w-4" />
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="mt-3 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-display text-lg font-bold leading-tight">{value}</p>
      {sub && <p className="text-[11px] text-muted-foreground">{sub}</p>}
      {typeof progress === "number" && (
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-surface-elevated">
          <div className="h-full bg-neon" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}

function SectionHeader({ title, action }: { title: string; action?: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="font-display text-base font-semibold">{title}</h2>
      {action && <button className="text-xs text-neon">{action}</button>}
    </div>
  );
}

function Challenge({ title, progress, total }: { title: string; progress: number; total: number }) {
  const pct = (progress / total) * 100;
  return (
    <div className="min-w-[200px] flex-shrink-0 rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
        <span>Desafio</span>
        <span className="text-neon">{progress}/{total}</span>
      </div>
      <p className="mt-2 text-sm font-semibold leading-snug">{title}</p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-elevated">
        <div className="h-full bg-neon glow-neon" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Activity({
  icon: Icon, title, time, value,
}: { icon: React.ComponentType<{ className?: string }>; title: string; time: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-surface-elevated text-neon">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-[11px] text-muted-foreground">{time}</p>
      </div>
      <span className="text-xs font-semibold text-neon">{value}</span>
    </div>
  );
}
