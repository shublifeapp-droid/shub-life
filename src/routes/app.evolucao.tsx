import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/evolucao")({
  component: Evolucao,
});

const days = [62, 70, 68, 78, 74, 82, 87];
const labels = ["S", "T", "Q", "Q", "S", "S", "D"];

function Evolucao() {
  const max = Math.max(...days);
  return (
    <div className="px-5 pt-12">
      <h1 className="font-display text-2xl font-bold">Evolução</h1>
      <p className="text-sm text-muted-foreground">Sua trajetória SHUB nos últimos 7 dias.</p>

      <div className="mt-6 rounded-3xl border border-neon/20 bg-surface p-6">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Score médio</p>
            <p className="font-display text-4xl font-bold">75.8</p>
          </div>
          <span className="rounded-full border border-neon/40 bg-neon/10 px-3 py-1 text-xs font-semibold text-neon">+12% vs semana</span>
        </div>

        <div className="mt-6 flex h-40 items-end gap-2">
          {days.map((v, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex w-full flex-1 items-end">
                <div
                  className="w-full rounded-t-lg bg-neon glow-neon"
                  style={{ height: `${(v / max) * 100}%`, opacity: 0.4 + (v / max) * 0.6 }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">{labels[i]}</span>
            </div>
          ))}
        </div>
      </div>

      <h2 className="mt-8 font-display text-base font-semibold">Métricas principais</h2>
      <div className="mt-3 space-y-3">
        {[
          { label: "Massa magra", value: "+1.4 kg", sub: "últimos 30 dias", pct: 78 },
          { label: "Recuperação", value: "92%", sub: "pico semanal", pct: 92 },
          { label: "Constância", value: "18 dias", sub: "streak ativo", pct: 64 },
          { label: "Foco mental", value: "Alto", sub: "humor estável", pct: 85 },
        ].map((m) => (
          <div key={m.label} className="rounded-2xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{m.label}</p>
              <p className="font-display text-lg font-bold text-neon">{m.value}</p>
            </div>
            <p className="text-[11px] text-muted-foreground">{m.sub}</p>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-surface-elevated">
              <div className="h-full bg-neon" style={{ width: `${m.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
