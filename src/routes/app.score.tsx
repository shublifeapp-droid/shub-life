import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ScoreRing } from "@/components/shub/ScoreRing";
import { LevelBadge } from "@/components/shub/LevelBadge";
import { EmptyState } from "@/components/shub/EmptyState";
import { Flame, Trophy, Zap, TrendingUp, Loader2, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export const Route = createFileRoute("/app/score")({
  component: ScorePage,
});

interface ScoreRow {
  score_date: string;
  total_score: number;
}
interface BadgeRow {
  badges: { name: string; tier: string | null } | null;
}

function ScorePage() {
  const { user, loading: userLoading } = useCurrentUser();

  const { data: scores, isLoading: loadingScores } = useQuery({
    queryKey: ["shub_scores", user?.id, "monthly"],
    enabled: !!user,
    queryFn: async (): Promise<ScoreRow[]> => {
      const { data, error } = await supabase
        .from("shub_scores")
        .select("score_date, total_score")
        .eq("user_id", user!.id)
        .order("score_date", { ascending: false })
        .limit(30);
      if (error) throw error;
      return (data ?? []).reverse();
    },
  });

  const { data: badges, isLoading: loadingBadges } = useQuery({
    queryKey: ["user_badges", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<BadgeRow[]> => {
      const { data, error } = await supabase
        .from("user_badges")
        .select("badges(name, tier)")
        .eq("user_id", user!.id);
      if (error) throw error;
      return (data ?? []) as unknown as BadgeRow[];
    },
  });

  if (userLoading || loadingScores) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const weekly = (scores ?? []).slice(-7).map((s) => s.total_score);
  const monthly = (scores ?? []).map((s) => s.total_score);
  const current = monthly[monthly.length - 1] ?? 0;
  const previous = monthly[monthly.length - 8] ?? current;
  const delta = current - previous;

  return (
    <div className="px-5 pt-12">
      <header className="fade-up">
        <p className="text-[10px] uppercase tracking-[0.3em] text-neon">SHUB SCORE</p>
        <h1 className="mt-1 font-display text-3xl font-bold">Sua performance</h1>
        <p className="mt-1 text-sm text-muted-foreground">Evolução baseada em 5 pilares.</p>
      </header>

      {monthly.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={Activity}
            title="Sem score ainda"
            description="Registre treino, sono, água e humor hoje para começar a calcular seu SHUB SCORE."
          />
        </div>
      ) : (
        <>
          <section className="mt-6 rounded-[28px] border border-neon/25 bg-surface p-6 fade-up">
            <div className="flex justify-center">
              <ScoreRing value={current} size={240} stroke={16} />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <Stat icon={Zap} label="Hoje" value={String(current)} />
              <Stat icon={Trophy} label="Pico (30d)" value={String(Math.max(...monthly))} />
              <Stat icon={TrendingUp} label="Δ semana" value={`${delta >= 0 ? "+" : ""}${delta}`} />
            </div>
          </section>

          {weekly.length > 0 && (
            <>
              <SectionTitle>Histórico semanal</SectionTitle>
              <Chart data={weekly} labels={["", "", "", "", "", "", ""].slice(0, weekly.length)} />
            </>
          )}

          {monthly.length > 7 && (
            <>
              <SectionTitle>Histórico mensal</SectionTitle>
              <Chart data={monthly} />
            </>
          )}
        </>
      )}

      <SectionTitle>Medalhas</SectionTitle>
      {loadingBadges ? (
        <div className="mt-3 flex justify-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : !badges || badges.length === 0 ? (
        <div className="mt-3 pb-10">
          <EmptyState icon={Trophy} title="Nenhuma medalha ainda" description="Complete desafios e mantenha streaks para conquistar medalhas." />
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-3 pb-10">
          {badges.map((b, i) => (
            <div key={i} className="card-premium p-4 flex flex-col items-center gap-2">
              <LevelBadge tier={(b.badges?.tier as "bronze" | "silver" | "gold" | "elite") ?? "bronze"} size="sm" />
              <p className="text-xs font-semibold">{b.badges?.name ?? "Medalha"}</p>
              <p className="text-[10px] text-muted-foreground">Conquistada</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-8 font-display text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">{children}</h2>;
}

function Stat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-elevated/60 p-3">
      <Icon className="mx-auto h-4 w-4 text-neon" />
      <p className="mt-1 font-display text-base font-bold">{value}</p>
      <p className="text-[9px] uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}

function Chart({ data, labels }: { data: number[]; labels?: string[] }) {
  const max = Math.max(...data, 1);
  return (
    <div className="mt-3 rounded-2xl border border-border bg-surface p-4">
      <div className="flex h-32 items-end gap-1.5">
        {data.map((v, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-neon/40 to-neon"
              style={{ height: `${(v / max) * 100}%`, boxShadow: "0 0 12px rgba(183,255,0,0.3)" }}
            />
            {labels && <span className="text-[9px] text-muted-foreground">{labels[i]}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
