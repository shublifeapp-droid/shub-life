import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Dumbbell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { EmptyState } from "@/components/shub/EmptyState";

export const Route = createFileRoute("/pro/treinos")({
  component: ProWorkouts,
});

function ProWorkouts() {
  const { user } = useCurrentUser();
  const { data, isLoading } = useQuery({
    queryKey: ["pro-workouts", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("workouts")
        .select("id, title, difficulty, duration_minutes, is_active, category, student_id")
        .eq("personal_id", user!.id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  if (isLoading) return <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin" /></div>;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-3xl font-bold">Treinos</h1>
        <p className="mt-1 text-sm text-muted-foreground">Treinos que você prescreveu.</p>
      </header>

      {!data || data.length === 0 ? (
        <EmptyState icon={Dumbbell} title="Nenhum treino criado" description="Crie treinos e atribua aos seus alunos." />
      ) : (
        <ul className="space-y-2">
          {(data as Array<{ id: string; title: string; difficulty: string | null; duration_minutes: number | null; is_active: boolean | null; category: string | null }>).map((row) => (
            <li key={row.id} className="flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3">
              <div>
                <p className="font-medium">{row.title}</p>
                <p className="text-xs text-muted-foreground">{row.category ?? "—"} · {row.difficulty ?? "—"} · {row.duration_minutes ?? 0} min</p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ${row.is_active ? "bg-neon/10 text-neon" : "bg-muted text-muted-foreground"}`}>{row.is_active ? "ativo" : "inativo"}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
