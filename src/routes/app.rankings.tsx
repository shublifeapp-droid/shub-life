import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, CalendarDays, CalendarRange, Loader2, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { EmptyState } from "@/components/shub/EmptyState";

export const Route = createFileRoute("/app/rankings")({
  component: RankingsPage,
});

const tabs = [
  { id: "daily", label: "Diário", icon: Calendar },
  { id: "weekly", label: "Semanal", icon: CalendarDays },
  { id: "monthly", label: "Mensal", icon: CalendarRange },
] as const;

type PeriodId = (typeof tabs)[number]["id"];

interface RankingRow {
  user_id: string;
  position: number;
  score: number;
  city: string | null;
}

function RankingsPage() {
  const [active, setActive] = useState<PeriodId>("weekly");
  const { user } = useCurrentUser();

  const { data, isLoading } = useQuery({
    queryKey: ["rankings", active],
    queryFn: async (): Promise<RankingRow[]> => {
      const { data, error } = await supabase
        .from("rankings")
        .select("user_id, position, score, city")
        .eq("period", active)
        .order("position", { ascending: true })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="px-5 pt-12 pb-10">
      <header className="fade-up">
        <p className="text-[10px] uppercase tracking-[0.3em] text-neon">RANKINGS</p>
        <h1 className="mt-1 font-display text-3xl font-bold">Top performers</h1>
      </header>

      <div className="mt-5 grid grid-cols-3 gap-2">
        {tabs.map((t) => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`flex flex-col items-center gap-1 rounded-2xl border px-2 py-3 text-[10px] font-semibold uppercase tracking-wider transition ${
                isActive ? "border-neon bg-neon/10 text-neon" : "border-border bg-surface text-muted-foreground"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="mt-10 flex justify-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : !data || data.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={Trophy}
            title="Ranking ainda vazio"
            description="Treine, conquiste XP e suba no ranking. Os primeiros a evoluir definem o ritmo."
          />
        </div>
      ) : (
        <div className="mt-5 card-premium overflow-hidden">
          {data.map((r) => {
            const me = r.user_id === user?.id;
            const pos = r.position;
            return (
              <div
                key={r.user_id}
                className={`flex items-center justify-between border-b border-border px-4 py-3 last:border-0 ${
                  me ? "bg-neon/5" : ""
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold ${
                      pos === 1
                        ? "bg-tier-gold text-background"
                        : pos === 2
                        ? "bg-tier-silver text-background"
                        : pos === 3
                        ? "bg-tier-bronze text-background"
                        : "bg-secondary"
                    }`}
                  >
                    {pos}
                  </span>
                  <div className="min-w-0">
                    <p className={`truncate text-sm ${me ? "font-bold text-neon" : "font-medium"}`}>
                      {me ? "Você" : "Atleta SHUB"}
                    </p>
                    {r.city && (
                      <p className="truncate text-[10px] text-muted-foreground">{r.city}</p>
                    )}
                  </div>
                </div>
                <span className="font-display text-lg font-bold text-neon">{r.score}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
