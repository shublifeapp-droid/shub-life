import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ArrowLeft, Activity, Dumbbell, Flame } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/pro/alunos/$id")({
  component: StudentDetail,
});

function StudentDetail() {
  const { id } = Route.useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["pro-student-detail", id],
    queryFn: async () => {
      const [profile, scores, workouts, streak] = await Promise.all([
        supabase.from("profiles").select("nickname, avatar_url, shub_score, bio").eq("id", id).maybeSingle(),
        supabase.from("shub_scores").select("score_date, total_score").eq("user_id", id).order("score_date", { ascending: false }).limit(14),
        supabase.from("workout_logs").select("id, date, duration_actual").eq("user_id", id).order("date", { ascending: false }).limit(10),
        supabase.from("streaks").select("current_streak, best_streak").eq("user_id", id).maybeSingle(),
      ]);
      return {
        profile: profile.data,
        scores: scores.data ?? [],
        workouts: workouts.data ?? [],
        streak: streak.data,
      };
    },
  });

  if (isLoading || !data) return <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin" /></div>;

  const p = data.profile as { nickname: string | null; shub_score: number | null; bio: string | null } | null;
  const st = data.streak as { current_streak: number; best_streak: number } | null;

  return (
    <div className="space-y-6">
      <Link to="/pro/alunos" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <header className="flex items-center gap-4">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-neon/10 text-neon text-2xl font-bold">
          {(p?.nickname ?? "?").slice(0, 1).toUpperCase()}
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">{p?.nickname ?? "Aluno"}</h1>
          {p?.bio && <p className="text-sm text-muted-foreground">{p.bio}</p>}
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-3">
        <Kpi icon={Activity} label="SHUB Score" value={String(p?.shub_score ?? 0)} />
        <Kpi icon={Flame} label="Streak atual" value={String(st?.current_streak ?? 0)} />
        <Kpi icon={Dumbbell} label="Treinos (10)" value={String(data.workouts.length)} />
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">Score (14 dias)</h2>
        <div className="rounded-2xl border border-border bg-surface p-4">
          <div className="flex h-24 items-end gap-1.5">
            {[...data.scores].reverse().map((s, i) => {
              const v = (s as { total_score: number }).total_score;
              const max = Math.max(...data.scores.map((x) => (x as { total_score: number }).total_score), 1);
              return <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-neon/40 to-neon" style={{ height: `${(v / max) * 100}%` }} />;
            })}
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">Treinos recentes</h2>
        <ul className="space-y-2">
          {(data.workouts as Array<{ id: string; date: string; duration_actual: number | null }>).map((row) => (
            <li key={row.id} className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm flex items-center justify-between">
              <span>Treino em {new Date(row.date).toLocaleDateString("pt-BR")}</span>
              <span className="text-xs text-muted-foreground">{row.duration_actual ?? 0} min</span>
            </li>
          ))}
          {data.workouts.length === 0 && <p className="text-sm text-muted-foreground">Nenhum treino concluído ainda.</p>}
        </ul>
      </section>
    </div>
  );
}

function Kpi({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center gap-2 text-muted-foreground"><Icon className="h-4 w-4 text-neon" /><span className="text-[10px] uppercase tracking-wider">{label}</span></div>
      <p className="mt-3 font-display text-2xl font-bold">{value}</p>
    </div>
  );
}
