import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { EmptyState } from "@/components/shub/EmptyState";

export const Route = createFileRoute("/app/evolucao")({
  component: Evolucao,
});

interface ScoreRow {
  score_date: string;
  total_score: number;
}

const LABELS = ["D", "S", "T", "Q", "Q", "S", "S"];

function Evolucao() {
  const { user } = useCurrentUser();

  const { data, isLoading } = useQuery({
    queryKey: ["shub-scores-week", user?.id],
    queryFn: async (): Promise<ScoreRow[]> => {
      const from = new Date();
      from.setDate(from.getDate() - 6);
      const { data, error } = await supabase
        .from("shub_scores")
        .select("score_date, total_score")
        .gte("score_date", from.toISOString().slice(0, 10))
        .order("score_date", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });

  const days = data ?? [];
  const max = days.length > 0 ? Math.max(...days.map((d) => d.total_score), 1) : 1;
  const avg =
    days.length > 0
      ? (days.reduce((acc, d) => acc + d.total_score, 0) / days.length).toFixed(1)
      : "0";

  return (
    <div className="px-5 pt-12 pb-10">
      <h1 className="font-display text-2xl font-bold">Evolução</h1>
      <p className="text-sm text-muted-foreground">Sua trajetória SHUB nos últimos 7 dias.</p>

      {isLoading ? (
        <div className="mt-10 flex justify-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : days.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={TrendingUp}
            title="Sem histórico ainda"
            description="Registre seus pilares (treino, sono, água, humor) por alguns dias e sua evolução aparece aqui."
          />
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-neon/20 bg-surface p-6">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Score médio
              </p>
              <p className="font-display text-4xl font-bold">{avg}</p>
            </div>
          </div>

          <div className="mt-6 flex h-40 items-end gap-2">
            {days.map((d) => {
              const day = new Date(d.score_date).getDay();
              return (
                <div key={d.score_date} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t-lg bg-neon glow-neon"
                      style={{
                        height: `${(d.total_score / max) * 100}%`,
                        opacity: 0.4 + (d.total_score / max) * 0.6,
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{LABELS[day]}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
