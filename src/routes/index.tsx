import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  component: Splash,
});

function Splash() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6">
      {/* radial glow bg */}
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "var(--gradient-radial-neon)" }} />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-neon/20 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center gap-6 fade-up">
        <div className="relative">
          <div className="absolute inset-0 rounded-3xl bg-neon/30 blur-2xl" />
          <div className="relative grid h-24 w-24 place-items-center rounded-3xl border border-neon/40 bg-surface-elevated glow-neon">
            <span className="font-display text-3xl font-bold text-neon">S</span>
          </div>
        </div>
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight">
            SHUB <span className="text-neon">LIFE</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">Muito além do treino</p>
        </div>

        <div className="mt-8 h-1 w-40 overflow-hidden rounded-full bg-surface-elevated">
          <div className="h-full w-1/2 bg-neon shimmer" />
        </div>
      </div>

      {show && (
        <div className="absolute bottom-12 left-0 right-0 flex justify-center px-6 fade-up">
          <Link
            to="/onboarding"
            className="rounded-full bg-neon px-8 py-3 text-sm font-semibold text-neon-foreground glow-neon transition-transform active:scale-95"
          >
            Começar
          </Link>
        </div>
      )}
    </div>
  );
}
