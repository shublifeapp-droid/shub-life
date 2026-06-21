import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ChevronRight, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { EmptyState } from "@/components/shub/EmptyState";

export const Route = createFileRoute("/pro/alunos")({
  component: ProStudents,
});

function ProStudents() {
  const { user } = useCurrentUser();

  const { data, isLoading } = useQuery({
    queryKey: ["pro-students", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data: rels } = await supabase
        .from("personal_students")
        .select("id, student_id, status, start_date")
        .eq("personal_id", user!.id)
        .order("created_at", { ascending: false });
      const ids = (rels ?? []).map((r) => (r as { student_id: string }).student_id);
      if (ids.length === 0) return [];
      const { data: profs } = await supabase.from("profiles").select("id, nickname, avatar_url, shub_score").in("id", ids);
      const profMap = new Map((profs ?? []).map((p) => [(p as { id: string }).id, p]));
      return (rels ?? []).map((r) => {
        const row = r as { id: string; student_id: string; status: string; start_date: string | null };
        const prof = profMap.get(row.student_id) as { nickname: string | null; avatar_url: string | null; shub_score: number | null } | undefined;
        return { ...row, profile: prof };
      });
    },
  });

  if (isLoading) return <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin" /></div>;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-3xl font-bold">Meus alunos</h1>
        <p className="mt-1 text-sm text-muted-foreground">Acompanhe seus alunos e prescreva treinos.</p>
      </header>

      {!data || data.length === 0 ? (
        <EmptyState icon={Users} title="Nenhum aluno vinculado" description="Compartilhe seu código de afiliado para começar." />
      ) : (
        <ul className="space-y-2">
          {data.map((s) => (
            <li key={s.id}>
              <Link
                to="/pro/alunos/$id"
                params={{ id: s.student_id }}
                className="flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3 transition hover:border-neon/40"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-neon/10 text-neon font-semibold">
                    {(s.profile?.nickname ?? "?").slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{s.profile?.nickname ?? "Aluno"}</p>
                    <p className="text-xs text-muted-foreground">Score {s.profile?.shub_score ?? 0} · {s.status}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
