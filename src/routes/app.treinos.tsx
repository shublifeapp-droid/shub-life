import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Play, Clock, Flame, Dumbbell, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRealtimeInvalidate } from "@/hooks/useRealtimeInvalidate";
import { EmptyState } from "@/components/shub/EmptyState";

export const Route = createFileRoute("/app/treinos")({
  component: Treinos,
});

interface WorkoutRow {
  id: string;
  title: string;
  category: string | null;
  duration_minutes: number | null;
  estimated_calories: number | null;
  updated_at: string;
}

function Treinos() {
  const { user } = useCurrentUser();
  useRealtimeInvalidate("workouts", ["workouts", user?.id], user ? `student_id=eq.${user.id}` : undefined);
  const { data, isLoading } = useQuery({
    queryKey: ["workouts", user?.id],
    queryFn: async (): Promise<WorkoutRow[]> => {
      const { data, error } = await supabase
        .from("workouts")
        .select("id, title, category, duration_minutes, estimated_calories, updated_at")
        .eq("is_active", true)
        .order("updated_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });

  const today = data?.[0];
  const rest = (data ?? []).slice(1);

  return (
    <div className="px-5 pt-12 pb-10">
      <h1 className="font-display text-2xl font-bold">Treinos</h1>
      <p className="text-sm text-muted-foreground">Seu plano semanal SHUB.</p>

      {isLoading ? (
        <div className="mt-10 flex justify-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : !data || data.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={Dumbbell}
            title="Nenhum treino cadastrado"
            description="Quando seu personal liberar a programação, seus treinos aparecem aqui."
          />
        </div>
      ) : (
        <>
          {today && (
            <div className="mt-6 overflow-hidden rounded-3xl border border-neon/30 bg-surface">
              <div className="relative p-6">
                <div className="pointer-events-none absolute -top-16 -right-10 h-48 w-48 rounded-full bg-neon/20 blur-3xl" />
                <p className="text-[10px] uppercase tracking-widest text-neon">Próximo treino</p>
                <h2 className="mt-1 font-display text-2xl font-bold">{today.title}</h2>
                {today.category && (
                  <p className="text-xs text-muted-foreground">{today.category}</p>
                )}
                <div className="mt-4 flex gap-4 text-xs">
                  {today.duration_minutes != null && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-neon" /> {today.duration_minutes} min
                    </div>
                  )}
                  {today.estimated_calories != null && (
                    <div className="flex items-center gap-1.5">
                      <Flame className="h-4 w-4 text-neon" /> {today.estimated_calories} kcal
                    </div>
                  )}
                </div>
                <Link
                  to="/app/treinos/$id"
                  params={{ id: today.id }}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-neon px-5 py-3 text-sm font-semibold text-neon-foreground glow-neon active:scale-95 transition"
                >
                  <Play className="h-4 w-4 fill-current" /> Iniciar treino
                </Link>
              </div>
            </div>
          )}

          {rest.length > 0 && (
            <>
              <h2 className="mt-8 font-display text-base font-semibold">Sua semana</h2>
              <div className="mt-3 space-y-3">
                {rest.map((p) => (
                  <Link
                    key={p.id}
                    to="/app/treinos/$id"
                    params={{ id: p.id }}
                    className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 transition active:scale-[0.98]"
                  >
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-surface-elevated text-neon">
                      <Play className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{p.title}</p>
                      {p.category && (
                        <p className="text-[11px] text-muted-foreground">{p.category}</p>
                      )}
                    </div>
                    <div className="text-right">
                      {p.duration_minutes != null && (
                        <p className="text-xs text-neon">{p.duration_minutes} min</p>
                      )}
                      {p.estimated_calories != null && (
                        <p className="text-[11px] text-muted-foreground">
                          {p.estimated_calories} kcal
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
