import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, Pause, Play, SkipForward, Check } from "lucide-react";

export const Route = createFileRoute("/app/treinos/$id")({
  component: ExecucaoPage,
});

const exercises = [
  { name: "Supino reto", sets: 4, reps: "10-12", rest: 60 },
  { name: "Crucifixo halteres", sets: 3, reps: "12", rest: 45 },
  { name: "Desenvolvimento", sets: 4, reps: "10", rest: 60 },
  { name: "Elevação lateral", sets: 3, reps: "15", rest: 45 },
  { name: "Tríceps corda", sets: 4, reps: "12", rest: 45 },
];

function ExecucaoPage() {
  const [current, setCurrent] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);
  const [done, setDone] = useState<number[]>([]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const ex = exercises[current];
  const total = exercises.length;
  const progress = (done.length / total) * 100;
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  const completeSet = () => {
    setDone((d) => [...new Set([...d, current])]);
    if (current < total - 1) setCurrent(current + 1);
  };

  return (
    <div className="px-5 pt-12 pb-10">
      <div className="flex items-center justify-between fade-up">
        <Link to="/app/treinos" className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-neon">TREINO A · PEITO/OMBRO</p>
          <p className="font-display text-sm font-semibold">{current + 1} / {total}</p>
        </div>
        <div className="w-10" />
      </div>

      <div className="mt-4 h-1 overflow-hidden rounded-full bg-secondary">
        <div className="h-full rounded-full bg-neon transition-all duration-500" style={{ width: `${progress}%`, boxShadow: "0 0 8px var(--neon)" }} />
      </div>

      <section className="mt-6 rounded-[28px] border border-neon/25 bg-surface p-6 text-center fade-up">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Exercício atual</p>
        <h2 className="mt-1 font-display text-2xl font-bold">{ex.name}</h2>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <Stat label="Séries" value={String(ex.sets)} />
          <Stat label="Reps" value={ex.reps} />
          <Stat label="Descanso" value={`${ex.rest}s`} />
        </div>

        <div className="mt-6">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Cronômetro</p>
          <p className="font-display text-6xl font-bold tabular-nums text-neon">{mm}:{ss}</p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => setRunning((r) => !r)}
            className="grid h-14 w-14 place-items-center rounded-full border border-border bg-surface-elevated"
          >
            {running ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </button>
          <button
            onClick={completeSet}
            className="flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-neon text-sm font-bold text-neon-foreground glow-neon active:scale-95"
          >
            <Check className="h-5 w-5" /> Concluir série
          </button>
          <button
            onClick={() => current < total - 1 && setCurrent(current + 1)}
            className="grid h-14 w-14 place-items-center rounded-full border border-border bg-surface-elevated"
          >
            <SkipForward className="h-6 w-6" />
          </button>
        </div>
      </section>

      <h3 className="mt-8 font-display text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Lista de exercícios</h3>
      <div className="mt-3 space-y-2">
        {exercises.map((e, i) => {
          const isDone = done.includes(i);
          const isCurrent = i === current;
          return (
            <button
              key={e.name}
              onClick={() => setCurrent(i)}
              className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                isCurrent ? "border-neon bg-neon/5" : "border-border bg-surface"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${
                    isDone ? "bg-neon text-neon-foreground" : "bg-secondary"
                  }`}
                >
                  {isDone ? <Check className="h-4 w-4" /> : i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold">{e.name}</p>
                  <p className="text-[10px] text-muted-foreground">{e.sets}x{e.reps} · {e.rest}s</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {done.length === total && (
        <div className="mt-6 rounded-3xl border border-neon/40 bg-neon/10 p-5 text-center fade-up">
          <p className="font-display text-lg font-bold text-neon">Treino concluído! 🔥</p>
          <p className="mt-1 text-xs text-muted-foreground">+120 XP · Streak +1 dia</p>
          <Link to="/app" className="mt-4 inline-block rounded-full bg-neon px-6 py-2 text-sm font-bold text-neon-foreground">
            Voltar para Home
          </Link>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-elevated/60 p-3">
      <p className="font-display text-xl font-bold">{value}</p>
      <p className="text-[9px] uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}
