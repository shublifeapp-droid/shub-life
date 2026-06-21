import { Link, useRouterState } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { LogOut } from "lucide-react";
import { Logo } from "./Logo";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

export interface DashNavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

interface Props {
  title: string;
  subtitle?: string;
  items: DashNavItem[];
  children: React.ReactNode;
}

export function DashShell({ title, subtitle, items, children }: Props) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const qc = useQueryClient();
  const navigate = useNavigate();

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-surface px-4 py-6 md:flex md:flex-col">
        <Logo className="h-8 w-auto self-start object-contain" />
        <div className="mt-6">
          <p className="text-[10px] uppercase tracking-[0.3em] text-neon">{title}</p>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <nav className="mt-6 flex flex-1 flex-col gap-1">
          {items.map((it) => {
            const active = it.exact ? path === it.to : path.startsWith(it.to);
            const Icon = it.icon;
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  active
                    ? "bg-neon/10 text-neon"
                    : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={active ? 2.5 : 1.8} />
                <span className="font-medium">{it.label}</span>
              </Link>
            );
          })}
        </nav>
        <button
          onClick={signOut}
          className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl md:hidden">
        <Logo className="h-7 w-auto" />
        <p className="text-[10px] uppercase tracking-[0.25em] text-neon">{title}</p>
      </header>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-surface-elevated/95 backdrop-blur-xl md:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {items.slice(0, 5).map((it) => {
            const active = it.exact ? path === it.to : path.startsWith(it.to);
            const Icon = it.icon;
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 ${
                  active ? "text-neon" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 1.8} />
                <span className="text-[9px] font-medium">{it.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <main className="px-5 pb-24 pt-6 md:ml-64 md:px-10 md:pb-10 md:pt-10">{children}</main>
    </div>
  );
}
