import { Link, Outlet, createFileRoute, redirect, useRouterState } from "@tanstack/react-router";
import { Home, Zap, Dumbbell, Footprints, Users, User, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/shub/Logo";

export const Route = createFileRoute("/app")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/login" });
  },
  component: AppLayout,
});

const tabs = [
  { to: "/app", label: "Home", icon: Home, exact: true },
  { to: "/app/score", label: "Score", icon: Zap, exact: false },
  { to: "/app/treinos", label: "Treinos", icon: Dumbbell, exact: false },
  { to: "/app/run", label: "Run", icon: Footprints, exact: false },
  { to: "/app/comunidade", label: "Comunidade", icon: Users, exact: false },
  { to: "/app/perfil", label: "Perfil", icon: User, exact: false },
] as const;


function AppLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="relative mx-auto min-h-screen max-w-md bg-background pb-28">
      <div className="sticky top-0 z-20 flex items-center justify-center border-b border-border/40 bg-background/80 px-5 py-3 backdrop-blur-xl">
        <Logo className="h-7 w-auto" />
      </div>
      <Outlet />

      {/* Floating AI assistant */}
      <Link
        to="/app"
        aria-label="Assistente IA"
        className="fixed bottom-24 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-neon text-neon-foreground glow-neon pulse-neon active:scale-95 transition-transform"
      >
        <Sparkles className="h-6 w-6" strokeWidth={2.5} />
      </Link>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-md -translate-x-1/2 px-4 pb-4 pt-2">
        <div className="flex items-center justify-between rounded-3xl border border-border bg-surface-elevated/90 px-2 py-2 backdrop-blur-xl shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.6)]">
          {tabs.map((t) => {
            const active = t.exact ? path === t.to : path.startsWith(t.to);
            const Icon = t.icon;
            return (
              <Link
                key={t.to}
                to={t.to}
                className={`relative flex flex-1 flex-col items-center gap-1 rounded-2xl py-2 transition ${
                  active ? "text-neon" : "text-muted-foreground"
                }`}
              >
                {active && (
                  <span className="absolute -top-2 h-1 w-8 rounded-full bg-neon glow-neon" />
                )}
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 1.8} />
                <span className="text-[10px] font-medium tracking-wide">{t.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
