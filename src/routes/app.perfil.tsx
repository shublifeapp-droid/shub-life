import { Link, createFileRoute } from "@tanstack/react-router";
import { Settings, Award, LogOut, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/app/perfil")({
  component: Perfil,
});

function Perfil() {
  return (
    <div className="px-5 pt-12">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Perfil</h1>
        <button className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface">
          <Settings className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-6 rounded-3xl border border-neon/20 bg-surface p-6 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-neon/40 bg-surface-elevated font-display text-xl font-bold glow-neon-soft">
          LS
        </div>
        <h2 className="mt-3 font-display text-xl font-bold">Lucas Shubert</h2>
        <p className="text-xs text-muted-foreground">Membro SHUB · desde 2024</p>

        <div className="mt-5 grid grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-surface-elevated py-3">
          <Stat label="Treinos" value="184" />
          <Stat label="Streak" value="18" />
          <Stat label="Score" value="87" />
        </div>
      </div>

      <h2 className="mt-8 font-display text-base font-semibold flex items-center gap-2">
        <Award className="h-4 w-4 text-neon" /> Conquistas
      </h2>
      <div className="mt-3 flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 [scrollbar-width:none]">
        {["🔥 30 dias", "💪 100 treinos", "🌙 Sono master", "💧 Hidratação", "🧠 Foco zen"].map((b) => (
          <div key={b} className="flex-shrink-0 rounded-2xl border border-neon/30 bg-surface px-4 py-3 text-xs font-semibold">
            {b}
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-2">
        {["Configurações da conta", "Notificações", "Plano SHUB Pro", "Privacidade", "Suporte"].map((item) => (
          <button key={item} className="flex w-full items-center justify-between rounded-2xl border border-border bg-surface p-4 text-sm">
            <span>{item}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}
      </div>

      <Link to="/login" className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-surface p-4 text-sm font-medium text-destructive">
        <LogOut className="h-4 w-4" /> Sair da conta
      </Link>

      <p className="mt-8 text-center text-[10px] tracking-[0.3em] text-muted-foreground">
        SHUB LIFE · MUITO ALÉM DO TREINO
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-display text-xl font-bold text-neon">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}
