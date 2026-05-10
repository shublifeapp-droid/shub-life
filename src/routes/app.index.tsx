import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Bell, Dumbbell, Droplets, Moon, Smile, Apple, Flame, ChevronRight,
  Sparkles, TrendingUp, Trophy, Play, Activity as ActivityIcon, Brain,
} from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/app/")({
  component: HomeScreen,
});

// Score weighted from 5 pillars
const pillars = {
  treino: 92,
  sono: 88,
  alimentacao: 76,
  hidratacao: 64,
  humor: 90,
};
const SHUB_SCORE = Math.round(
  (pillars.treino + pillars.sono + pillars.alimentacao + pillars.hidratacao + pillars.humor) / 5
);

function getGreeting() {
  const h = new Date().getHours();
  if (h < 6) return "Boa madrugada";
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

function HomeScreen() {
  return (
    <div className="relative">
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-neon/10 blur-3xl" />
      </div>

      <div className="relative px-5 pt-12">
        <Header />
        <ScoreHero score={SHUB_SCORE} />
        <PillarsRow />
        <TrainingToday />
        <TwoUp>
          <MoodCard />
          <WaterCard />
        </TwoUp>
        <SleepCard />
        <DailyChallenge />
        <WeeklyEvolution />
        <AIInsights />

        <p className="mb-6 mt-10 text-center text-[10px] tracking-[0.4em] text-muted-foreground">
          SHUB LIFE · MUITO ALÉM DO TREINO
        </p>
      </div>
    </div>
  );
}

/* ───────────────────────────── HEADER ───────────────────────────── */

function Header() {
  return (
    <div className="flex items-center justify-between fade-up">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="grid h-11 w-11 place-items-center rounded-full border border-neon/40 bg-surface-elevated text-xs font-bold">
            LS
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-neon glow-neon" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{getGreeting()}</p>
          <h1 className="font-display text-lg font-bold leading-tight">Lucas <span className="text-neon">⚡</span></h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface">
          <ActivityIcon className="h-4 w-4" />
        </button>
        <button className="relative grid h-10 w-10 place-items-center rounded-full border border-border bg-surface">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-neon glow-neon" />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────── SHUB SCORE ─────────────────────────── */

function ScoreHero({ score }: { score: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setV(score), 80);
    return () => clearTimeout(t);
  }, [score]);

  return (
    <div className="relative mt-6 overflow-hidden rounded-[28px] border border-neon/25 bg-surface p-6 fade-up">
      {/* glow accents */}
      <div className="pointer-events-none absolute -top-24 -right-20 h-64 w-64 rounded-full bg-neon/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-10 h-56 w-56 rounded-full bg-neon/10 blur-3xl" />

      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-neon">SHUB SCORE</p>
          <p className="mt-1 text-xs text-muted-foreground">Performance humana hoje</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-neon/40 bg-neon/10 px-2.5 py-1 text-[10px] font-semibold text-neon">
          <Flame className="h-3 w-3" /> +6 hoje
        </span>
      </div>

      <div className="relative mt-4 flex items-center justify-center">
        <ScoreRing value={v} size={210} stroke={14} />
      </div>

      <div className="relative mt-5 grid grid-cols-3 gap-3">
        <Mini label="Estado" value="Pico" />
        <Mini label="Recuperação" value="92%" />
        <Mini label="Streak" value="18d" />
      </div>
    </div>
  );
}

function ScoreRing({ value, size = 200, stroke = 12 }: { value: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.93 0.27 130)" />
            <stop offset="100%" stopColor="oklch(0.85 0.25 145)" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--surface-elevated)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          stroke="url(#ringGrad)" strokeWidth={stroke} fill="none" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.6s cubic-bezier(.22,1,.36,1)", filter: "drop-shadow(0 0 10px var(--neon))" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">SHUB</p>
        <p className="font-display text-6xl font-bold leading-none">{value}</p>
        <p className="mt-1 text-[10px] text-muted-foreground">de 100</p>
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-elevated/60 p-3 text-center">
      <p className="text-[9px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-sm font-bold text-neon">{value}</p>
    </div>
  );
}

/* ───────────────────────── PILLARS BAR ───────────────────────── */

function PillarsRow() {
  const items = [
    { k: "Treino", v: pillars.treino, icon: Dumbbell },
    { k: "Sono", v: pillars.sono, icon: Moon },
    { k: "Nutri", v: pillars.alimentacao, icon: Apple },
    { k: "Água", v: pillars.hidratacao, icon: Droplets },
    { k: "Humor", v: pillars.humor, icon: Smile },
  ];
  return (
    <div className="mt-5 rounded-3xl border border-border bg-surface p-4 fade-up">
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Pilares</p>
        <span className="text-[10px] text-neon">média 82</span>
      </div>
      <div className="mt-4 grid grid-cols-5 gap-2">
        {items.map(({ k, v, icon: Icon }) => (
          <div key={k} className="flex flex-col items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-surface-elevated text-neon">
              <Icon className="h-4 w-4" />
            </div>
            <div className="h-16 w-1.5 overflow-hidden rounded-full bg-surface-elevated">
              <div
                className="mt-auto h-full w-full origin-bottom bg-neon glow-neon"
                style={{ transform: `scaleY(${v / 100})`, transition: "transform 1.2s ease-out" }}
              />
            </div>
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground">{k}</p>
            <p className="-mt-1 font-display text-[11px] font-bold">{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── TRAINING TODAY ───────────────────────── */

function TrainingToday() {
  return (
    <Section title="Treino do dia" action="Ver plano">
      <div className="relative overflow-hidden rounded-3xl border border-neon/30 bg-surface">
        <div className="pointer-events-none absolute -top-14 -right-10 h-48 w-48 rounded-full bg-neon/20 blur-3xl" />
        <div className="relative p-5">
          <div className="flex items-center justify-between">
            <span className="rounded-full border border-neon/40 bg-neon/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-neon">
              Push · Força
            </span>
            <span className="text-[10px] text-muted-foreground">08 exercícios</span>
          </div>
          <h3 className="mt-3 font-display text-2xl font-bold leading-tight">Push Power A</h3>
          <p className="text-xs text-muted-foreground">Peito · Ombro · Tríceps</p>

          <div className="mt-4 flex items-center gap-4 text-[11px]">
            <Pill label="55 min" />
            <Pill label="480 kcal" />
            <Pill label="Intensidade alta" />
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-full bg-neon px-5 py-3 text-xs font-semibold text-neon-foreground glow-neon active:scale-95 transition">
              <Play className="h-3.5 w-3.5 fill-current" /> Iniciar treino
            </button>
            <button className="rounded-full border border-border bg-surface-elevated px-4 py-3 text-xs">Pré-visualizar</button>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Pill({ label }: { label: string }) {
  return <span className="rounded-full border border-border bg-surface-elevated px-2.5 py-1 text-muted-foreground">{label}</span>;
}

/* ─────────────────────────── MOOD ─────────────────────────── */

function MoodCard() {
  const moods = ["😴", "😐", "🙂", "🔥", "🚀"];
  const [sel, setSel] = useState(3);
  return (
    <Card>
      <CardHeader icon={Smile} label="Humor" trailing={<span className="text-[10px] text-neon">+2 vs ontem</span>} />
      <p className="mt-2 font-display text-lg font-bold">Em alta</p>
      <p className="text-[11px] text-muted-foreground">energia & foco no pico</p>
      <div className="mt-4 flex items-center justify-between">
        {moods.map((m, i) => (
          <button
            key={i}
            onClick={() => setSel(i)}
            className={`grid h-8 w-8 place-items-center rounded-full text-base transition ${
              sel === i ? "bg-neon scale-110 glow-neon" : "bg-surface-elevated"
            }`}
          >
            {m}
          </button>
        ))}
      </div>
    </Card>
  );
}

/* ─────────────────────────── WATER ─────────────────────────── */

function WaterCard() {
  const cur = 1.8, goal = 3.0;
  const pct = Math.min(100, (cur / goal) * 100);
  return (
    <Card>
      <CardHeader icon={Droplets} label="Hidratação" trailing={<span className="text-[10px] text-neon">{Math.round(pct)}%</span>} />
      <div className="mt-2 flex items-baseline gap-1">
        <p className="font-display text-2xl font-bold">{cur}</p>
        <p className="text-xs text-muted-foreground">/ {goal} L</p>
      </div>
      <div className="relative mt-3 h-16 overflow-hidden rounded-2xl border border-border bg-surface-elevated">
        <div
          className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-neon to-neon/40"
          style={{ height: `${pct}%`, transition: "height 1.2s ease-out", boxShadow: "0 0 30px var(--neon)" }}
        />
        <div className="absolute inset-0 grid place-items-center">
          <button className="rounded-full bg-background/60 px-3 py-1 text-[10px] font-semibold text-neon backdrop-blur">
            + 250 ml
          </button>
        </div>
      </div>
    </Card>
  );
}

/* ─────────────────────────── SLEEP ─────────────────────────── */

function SleepCard() {
  // simulated sleep stages: deep / rem / light / awake
  const stages = [
    { h: 0.4, c: "var(--neon)" },
    { h: 0.7, c: "color-mix(in oklab, var(--neon) 70%, transparent)" },
    { h: 0.3, c: "color-mix(in oklab, var(--neon) 40%, transparent)" },
    { h: 0.55, c: "color-mix(in oklab, var(--neon) 60%, transparent)" },
    { h: 0.85, c: "var(--neon)" },
    { h: 0.5, c: "color-mix(in oklab, var(--neon) 50%, transparent)" },
    { h: 0.7, c: "color-mix(in oklab, var(--neon) 70%, transparent)" },
    { h: 0.3, c: "color-mix(in oklab, var(--neon) 40%, transparent)" },
    { h: 0.6, c: "color-mix(in oklab, var(--neon) 60%, transparent)" },
    { h: 0.45, c: "color-mix(in oklab, var(--neon) 50%, transparent)" },
    { h: 0.2, c: "color-mix(in oklab, var(--neon) 30%, transparent)" },
    { h: 0.15, c: "color-mix(in oklab, var(--neon) 25%, transparent)" },
  ];
  return (
    <Section title="Qualidade do sono">
      <Card className="!p-5">
        <div className="flex items-end justify-between">
          <div>
            <CardHeader icon={Moon} label="Última noite" />
            <p className="mt-2 font-display text-3xl font-bold">7h 42m</p>
            <p className="text-[11px] text-muted-foreground">deep 1h 22m · rem 1h 58m</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Score</p>
            <p className="font-display text-2xl font-bold text-neon">92</p>
          </div>
        </div>

        <div className="mt-5 flex h-20 items-end gap-1.5">
          {stages.map((s, i) => (
            <div
              key={i}
              className="flex-1 rounded-md"
              style={{
                height: `${s.h * 100}%`,
                background: s.c,
                boxShadow: s.h > 0.7 ? "0 0 10px var(--neon)" : undefined,
                transition: "height 1s ease-out",
              }}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[9px] text-muted-foreground">
          <span>23:14</span><span>02:00</span><span>04:30</span><span>07:08</span>
        </div>
      </Card>
    </Section>
  );
}

/* ─────────────────────────── CHALLENGE ─────────────────────────── */

function DailyChallenge() {
  return (
    <Section title="Desafio diário">
      <div className="relative overflow-hidden rounded-3xl border border-neon/40 bg-surface p-5">
        <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-neon/25 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-neon text-neon-foreground glow-neon">
            <Trophy className="h-6 w-6" strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-widest text-neon">+50 XP</p>
            <h3 className="mt-1 font-display text-base font-bold leading-snug">
              Complete 30 minutos de cardio em zona 2
            </h3>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-elevated">
                <div className="h-full bg-neon glow-neon" style={{ width: "62%" }} />
              </div>
              <span className="text-[10px] font-semibold text-neon">62%</span>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">faltam 11 min · termina às 23:59</p>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ─────────────────────────── WEEKLY EVOLUTION ─────────────────────────── */

function WeeklyEvolution() {
  const days = [62, 70, 68, 78, 74, 82, SHUB_SCORE];
  const labels = ["S", "T", "Q", "Q", "S", "S", "D"];
  const max = 100;
  return (
    <Section title="Evolução semanal" action={<Link to="/app/evolucao" className="text-xs text-neon">Ver mais</Link>}>
      <Card className="!p-5">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Score médio</p>
            <p className="font-display text-3xl font-bold">75.8</p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-neon/40 bg-neon/10 px-2.5 py-1 text-[10px] font-semibold text-neon">
            <TrendingUp className="h-3 w-3" /> +12%
          </span>
        </div>

        <div className="relative mt-5 flex h-32 items-end gap-2">
          {days.map((v, i) => {
            const isToday = i === days.length - 1;
            return (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className={`w-full rounded-t-lg ${isToday ? "bg-neon glow-neon" : "bg-neon/30"}`}
                    style={{ height: `${(v / max) * 100}%`, transition: "height 1s ease-out" }}
                  />
                </div>
                <span className={`text-[10px] ${isToday ? "font-bold text-neon" : "text-muted-foreground"}`}>{labels[i]}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </Section>
  );
}

/* ─────────────────────────── AI INSIGHTS ─────────────────────────── */

function AIInsights() {
  const insights = [
    { icon: Brain, title: "Sua recuperação está em alta", text: "Mantenha intensidade. Janela ótima para PR de força." },
    { icon: Droplets, title: "Hidratação abaixo da meta", text: "Beba 1.2L nas próximas 4h para fechar o dia." },
    { icon: Moon, title: "Durma 22 min antes hoje", text: "Para sustentar score acima de 90 amanhã." },
  ];
  return (
    <Section title="Insights da IA" action={<span className="inline-flex items-center gap-1 text-xs text-neon"><Sparkles className="h-3 w-3" /> SHUB AI</span>}>
      <div className="space-y-2.5">
        {insights.map((it, i) => (
          <div key={i} className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4">
            <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-neon/10 text-neon ring-1 ring-neon/30">
              <it.icon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold leading-tight">{it.title}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{it.text}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ───────────────────────────── PRIMITIVES ───────────────────────────── */

function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mt-7 fade-up">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-base font-semibold">{title}</h2>
        {typeof action === "string" ? <button className="text-xs text-neon">{action}</button> : action}
      </div>
      {children}
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl border border-border bg-surface p-4 ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({
  icon: Icon, label, trailing,
}: { icon: React.ComponentType<{ className?: string }>; label: string; trailing?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="grid h-7 w-7 place-items-center rounded-lg bg-surface-elevated text-neon">
          <Icon className="h-3.5 w-3.5" />
        </div>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      </div>
      {trailing}
    </div>
  );
}

function TwoUp({ children }: { children: React.ReactNode }) {
  return <div className="mt-7 grid grid-cols-2 gap-3 fade-up">{children}</div>;
}
