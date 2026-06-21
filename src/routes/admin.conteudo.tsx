import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Trophy, Flag, Dumbbell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/conteudo")({
  component: AdminContent,
});

function AdminContent() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-content"],
    queryFn: async () => {
      const [badges, challenges, exercises, workouts] = await Promise.all([
        supabase.from("badges").select("id, name, level").order("name"),
        supabase.from("challenges").select("id, title, type").order("created_at", { ascending: false }).limit(100),
        supabase.from("exercises").select("id", { count: "exact", head: true }),
        supabase.from("workouts").select("id", { count: "exact", head: true }),
      ]);
      return {
        badges: badges.data ?? [],
        challenges: challenges.data ?? [],
        exercisesCount: exercises.count ?? 0,
        workoutsCount: workouts.count ?? 0,
      };
    },
  });

  if (isLoading || !data) return <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold">Conteúdo</h1>
        <p className="mt-1 text-sm text-muted-foreground">Medalhas, desafios e biblioteca.</p>
      </header>

      <section className="grid gap-3 md:grid-cols-2">
        <Counter icon={Dumbbell} label="Exercícios na biblioteca" value={data.exercisesCount} />
        <Counter icon={Dumbbell} label="Treinos cadastrados" value={data.workoutsCount} />
      </section>

      <Section icon={Trophy} title="Medalhas">
        <div className="grid gap-2 md:grid-cols-2">
          {(data.badges as Array<{ id: string; name: string; level: string | null }>).map((b) => (
            <div key={b.id} className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-2.5">
              <span className="text-sm">{b.name}</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{b.level ?? "—"}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section icon={Flag} title="Desafios">
        <div className="space-y-2">
          {(data.challenges as Array<{ id: string; title: string; type: string | null }>).map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-2.5">
              <span className="text-sm">{c.title}</span>
              <span className="rounded-full bg-neon/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-neon">{c.type ?? "—"}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Counter({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center gap-2 text-muted-foreground"><Icon className="h-4 w-4" /><span className="text-[10px] uppercase tracking-wider">{label}</span></div>
      <p className="mt-3 font-display text-2xl font-bold">{value.toLocaleString("pt-BR")}</p>
    </div>
  );
}

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold"><Icon className="h-4 w-4 text-neon" />{title}</h2>
      {children}
    </section>
  );
}
