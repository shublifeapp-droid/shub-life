import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { EmptyState } from "@/components/shub/EmptyState";

export const Route = createFileRoute("/app/desafios")({
  component: DesafiosPage,
});

interface ChallengeWithProgress {
  id: string;
  title: string;
  description: string | null;
  xp_reward: number | null;
  end_date: string | null;
  progress_percent: number;
}

function DesafiosPage() {
  const { user } = useCurrentUser();

  const { data: active, isLoading } = useQuery({
    queryKey: ["challenges-active", user?.id],
    queryFn: async (): Promise<ChallengeWithProgress[]> => {
      const today = new Date().toISOString().slice(0, 10);
      const { data: challenges, error } = await supabase
        .from("challenges")
        .select("id, title, description, xp_reward, end_date")
        .or(`end_date.is.null,end_date.gte.${today}`)
        .order("end_date", { ascending: true, nullsFirst: false })
        .limit(20);
      if (error) throw error;
      if (!challenges?.length || !user) return [];
      const { data: parts } = await supabase
        .from("challenge_participations")
        .select("challenge_id, progress_percent")
        .eq("user_id", user.id)
        .in(
          "challenge_id",
          challenges.map((c) => c.id),
        );
      const map = new Map(
        (parts ?? []).map((p) => [p.challenge_id, p.progress_percent ?? 0]),
      );
      return challenges.map((c) => ({
        ...c,
        progress_percent: map.get(c.id) ?? 0,
      }));
    },
    enabled: !!user,
  });

  return (
    <div className="px-5 pt-12 pb-10">
      <header className="fade-up">
        <p className="text-[10px] uppercase tracking-[0.3em] text-neon">DESAFIOS</p>
        <h1 className="mt-1 font-display text-3xl font-bold">Supere seus limites</h1>
      </header>

      {isLoading ? (
        <div className="mt-10 flex justify-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : !active || active.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={Trophy}
            title="Sem desafios ativos"
            description="Novos desafios semanais e mensais aparecem aqui. Volte em breve para somar XP."
          />
        </div>
      ) : (
        <section className="mt-6 space-y-3">
          {active.map((c) => {
            const pct = Math.min(100, Math.max(0, c.progress_percent));
            return (
              <div key={c.id} className="card-premium p-4 fade-up">
                <div className="flex items-start gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-neon/10 text-neon">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{c.title}</p>
                    {c.xp_reward != null && (
                      <p className="text-xs text-muted-foreground">+{c.xp_reward} XP</p>
                    )}
                    <div className="mt-3 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-neon transition-all duration-700"
                          style={{ width: `${pct}%`, boxShadow: "0 0 8px var(--neon)" }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-neon">{pct}%</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}
