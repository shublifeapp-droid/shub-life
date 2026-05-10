import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

const steps = [
  {
    title: "Evolução real",
    desc: "Acompanhe seu corpo, mente e performance em um só lugar.",
    icon: "📈",
  },
  {
    title: "Treinos inteligentes",
    desc: "Programas adaptativos guiados por IA, feitos para você.",
    icon: "⚡",
  },
  {
    title: "Vida em alto nível",
    desc: "Hábitos, sono, nutrição e mente. Performance humana completa.",
    icon: "🧬",
  },
];

function Onboarding() {
  const [i, setI] = useState(0);
  const step = steps[i];
  const last = i === steps.length - 1;

  return (
    <div className="relative flex min-h-screen flex-col bg-background px-6 pb-10 pt-12">
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "var(--gradient-radial-neon)" }} />

      <div className="relative z-10 flex justify-between">
        <span className="font-display text-sm font-semibold tracking-widest text-neon">SHUB LIFE</span>
        <Link to="/login" className="text-xs text-muted-foreground">Pular</Link>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center">
        <div key={i} className="fade-up">
          <div className="mx-auto grid h-32 w-32 place-items-center rounded-3xl border border-neon/30 bg-surface-elevated text-5xl glow-neon-soft float-soft">
            {step.icon}
          </div>
          <h2 className="mt-10 font-display text-3xl font-bold leading-tight text-balance">
            {step.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {step.desc}
          </p>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center gap-2">
        {steps.map((_, idx) => (
          <span
            key={idx}
            className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-neon" : "w-1.5 bg-muted"}`}
          />
        ))}
      </div>

      <div className="relative z-10 mt-8">
        {last ? (
          <Link
            to="/cadastro"
            className="block w-full rounded-full bg-neon py-4 text-center text-sm font-semibold text-neon-foreground glow-neon active:scale-[0.98] transition-transform"
          >
            Criar minha conta
          </Link>
        ) : (
          <button
            onClick={() => setI(i + 1)}
            className="block w-full rounded-full bg-neon py-4 text-center text-sm font-semibold text-neon-foreground glow-neon active:scale-[0.98] transition-transform"
          >
            Continuar
          </button>
        )}
        <Link to="/login" className="mt-3 block text-center text-xs text-muted-foreground">
          Já tenho uma conta
        </Link>
      </div>
    </div>
  );
}
