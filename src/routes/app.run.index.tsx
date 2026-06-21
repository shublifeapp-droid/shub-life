import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Footprints, Play, Loader2, MapPin, Clock, Gauge, Flame } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { EmptyState } from "@/components/shub/EmptyState";
import { formatDuration, formatPace } from "@/lib/shub/running";

export const Route = createFileRoute("/app/run/")({
  component: RunHomePage,
});

interface Activity {
  id: string;
  activity_type: string;
  start_time: string;
  duration_seconds: number;
  distance_km: number;
  avg_pace: number | null;
}

function RunHomePage() {
  const { user } = useCurrentUser();

  const { data, isLoading } = useQuery({
    queryKey: ["run-activities", user?.id],
    queryFn: async () => {
      if (!user) return { activities: [] as Activity[], stats: emptyStats() };
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      const { data: monthData } = await supabase
        .from("running_activities")
        .select("id, activity_type, start_time, duration_seconds, distance_km, avg_pace")
        .eq("user_id", user.id)
        .gte("start_time", monthStart.toISOString())
        .order("start_time", { ascending: false });

      const { data: recent } = await supabase
        .from("running_activities")
        .select("id, activity_type, start_time, duration_seconds, distance_km, avg_pace")
        .eq("user_id", user.id)
        .order("start_time", { ascending: false })
        .limit(10);

      const month = (monthData ?? []) as Activity[];
      const km = month.reduce((s, a) => s + Number(a.distance_km ?? 0), 0);
      const longest = month.reduce((m, a) => Math.max(m, Number(a.distance_km ?? 0)), 0);
      const totalTime = month.reduce((s, a) => s + (a.duration_seconds ?? 0), 0);
      const bestPace = month
        .map((a) => Number(a.avg_pace))
        .filter((p) => p > 0)
        .reduce((m, p) => (m === 0 ? p : Math.min(m, p)), 0);

      return {
        activities: (recent ?? []) as Activity[],
        stats: { km, runs: month.length, longest, bestPace, totalTime },
      };
    },
    enabled: !!user,
  });

  const stats = data?.stats ?? emptyStats();
  const activities = data?.activities ?? [];

  return (
    <div className="px-5 pt-12 pb-10">
      <header className="fade-up">
        <p className="text-[10px] uppercase tracking-[0.3em] text-neon">SHUB RUN</p>
        <h1 className="mt-1 font-display text-3xl font-bold">Muito além do treino.</h1>
        <p className="mt-1 text-sm text-muted-foreground">Suas corridas e caminhadas.</p>
      </header>

      <section className="mt-6 grid grid-cols-2 gap-3">
        <Metric icon={MapPin} label="Km do mês" value={stats.km.toFixed(2)} />
        <Metric icon={Footprints} label="Atividades" value={String(stats.runs)} />
        <Metric icon={Gauge} label="Maior distância" value={`${stats.longest.toFixed(2)} km`} />
        <Metric icon={Clock} label="Melhor pace" value={formatPace(stats.bestPace || null)} />
      </section>

      <div className="mt-4 card-premium p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-neon/10 text-neon">
            <Flame className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Tempo total no mês</p>
            <p className="font-display text-lg font-semibold">{formatDuration(stats.totalTime)}</p>
          </div>
        </div>
      </div>

      <Link
        to="/app/run/iniciar"
        className="mt-6 flex items-center justify-center gap-2 rounded-full bg-neon px-6 py-4 font-semibold text-neon-foreground glow-neon active:scale-95 transition-transform"
      >
        <Play className="h-5 w-5" strokeWidth={2.5} />
        Iniciar atividade
      </Link>

      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold">Histórico</h2>
        {isLoading ? (
          <div className="mt-6 flex justify-center text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : activities.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              icon={Footprints}
              title="Nenhuma atividade ainda"
              description="Inicie sua primeira corrida ou caminhada para começar a evoluir."
            />
          </div>
        ) : (
          <ul className="mt-3 space-y-2">
            {activities.map((a) => (
              <li key={a.id} className="card-premium p-4 fade-up">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold capitalize">{labelFor(a.activity_type)}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(a.start_time).toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg font-semibold text-neon">
                      {Number(a.distance_km ?? 0).toFixed(2)} km
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDuration(a.duration_seconds ?? 0)} · {formatPace(a.avg_pace)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Footprints;
  label: string;
  value: string;
}) {
  return (
    <div className="card-premium p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-[10px] uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-2 font-display text-xl font-semibold">{value}</p>
    </div>
  );
}

function labelFor(t: string): string {
  return t === "walk"
    ? "Caminhada"
    : t === "free"
      ? "Corrida livre"
      : t === "challenge"
        ? "Desafio"
        : "Corrida";
}

function emptyStats() {
  return { km: 0, runs: 0, longest: 0, bestPace: 0, totalTime: 0 };
}
