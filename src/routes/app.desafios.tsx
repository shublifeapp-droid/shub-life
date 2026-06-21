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
  goal: number;
  xp_reward: number;
  ends_at: string | null;
  progress: number;
}

function DesafiosPage() {
  const { user } = useCurrentUser();

  const { data: active, isLoading } = useQuery({
    queryKey: ["challenges-active", user?.id],
    queryFn: async (): Promise<ChallengeWithProgress[]> => {
      const { data: challenges, error } = await supabase
        .from("challenges")
        .select("id, title, goal, xp_reward, ends_at")
        .gte("ends_at", new Date().toISOString())
        .order("ends_at", { ascending: true })
        .limit(20);
      if (error) throw error;
      if (!challenges?.length || !user) return [];
      const { data: parts } = await supabase
        .from("challenge_participations")
        .select("challenge_id, progress")
        .eq("user_id", user.id)
        .in("challenge_id", challenges.map((c) => c.id));
      const map = new Map((parts ?? []).map((p) => [p.challenge_id, p.progress]));
      return challenges.map((c) => ({ ...c, progress: map.get(c.id) ?? 0 }));
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
            const pct = c.goal > 0 ? Math.min(100, Math.round((c.progress / c.goal) * 100)) : 0;
            return (
              <div key={c.id} className="card-premium p-4 fade-up">
                <div className="flex items-start gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-neon/10 text-neon">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{c.title}</p>
                    <p className="text-xs text-muted-foreground">+{c.xp_reward} XP</p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-neon transition-all duration-700"
                          style={{ width: `${pct}%`, boxShadow: "0 0 8px var(--neon)" }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-neon">
                        {c.progress}/{c.goal}
                      </span>
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
