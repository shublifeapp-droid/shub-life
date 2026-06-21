import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Bell, Dumbbell, Droplets, Moon, Smile, Apple, Flame,
  Sparkles, Trophy, Play, LogOut, Plus,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { EmptyState } from "@/components/shub/EmptyState";
import { toast } from "sonner";

export const Route = createFileRoute("/app/")({
  component: HomeScreen,
});

const WATER_GOAL_ML = 3000;

function getGreeting() {
  const h = new Date().getHours();
  if (h < 6) return "Boa madrugada";
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

interface ShubScoreRow {
  workout_score: number; water_score: number; sleep_score: number;
  mood_score: number; discipline_score: number; total_score: number;
  score_date: string;
}

function HomeScreen() {
  const navigate = useNavigate();
  const { user, loading: userLoading } = useCurrentUser();
  const qc = useQueryClient();

  const userName = useMemo(() => {
    if (!user) return "";
    const meta = user.user_metadata ?? {};
    return meta.nickname || (meta.full_name ? String(meta.full_name).split(" ")[0] : user.email?.split("@")[0]) || "Atleta";
  }, [user]);

  const { data: score } = useQuery({
    queryKey: ["shub_score_today", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<ShubScoreRow | null> => {
      const { data, error } = await supabase
        .from("shub_scores")
        .select("workout_score, water_score, sleep_score, mood_score, discipline_score, total_score, score_date")
        .eq("user_id", user!.id)
        .order("score_date", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as ShubScoreRow | null;
    },
  });

  const { data: weekScores = [] } = useQuery({
    queryKey: ["shub_scores_week", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shub_scores")
        .select("score_date, total_score")
        .eq("user_id", user!.id)
        .order("score_date", { ascending: false })
        .limit(7);
      if (error) throw error;
      return (data ?? []).reverse();
    },
  });

  const { data: streak } = useQuery({
    queryKey: ["streak", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("streaks")
        .select("current_streak, best_streak")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: waterMl = 0 } = useQuery({
    queryKey: ["water_today", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("water_logs")
        .select("amount_ml")
        .eq("user_id", user!.id)
        .eq("date", todayStr());
      if (error) throw error;
      return (data ?? []).reduce((s, r) => s + (r.amount_ml ?? 0), 0);
    },
  });

  const { data: sleep } = useQuery({
    queryKey: ["sleep_last", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sleep_logs")
        .select("total_minutes, deep_sleep_minutes, rem_sleep_minutes, score, date")
        .eq("user_id", user!.id)
        .order("date", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: lastMood } = useQuery({
    queryKey: ["mood_last", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mood_logs")
        .select("mood, logged_at")
        .eq("user_id", user!.id)
        .order("logged_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: nextWorkout } = useQuery({
    queryKey: ["next_workout", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workouts")
        .select("id, title, category, duration_minutes, estimated_calories")
        .eq("is_active", true)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: hasUnreadNotif = false } = useQuery({
    queryKey: ["notif_unread", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { count, error } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user!.id)
        .eq("is_read", false);
      if (error) throw error;
      return (count ?? 0) > 0;
    },
  });

  const addWater = useMutation({
    mutationFn: async (ml: number) => {
      const { error } = await supabase.from("water_logs").insert({
        user_id: user!.id,
        amount_ml: ml,
        date: todayStr(),
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["water_today", user?.id] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const logMood = useMutation({
    mutationFn: async (mood: number) => {
      const { error } = await supabase.from("mood_logs").insert({
        user_id: user!.id,
        mood,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mood_last", user?.id] });
      toast.success("Humor registrado");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleLogout = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    toast.success("Sessão encerrada");
    navigate({ to: "/login", replace: true });
  };

  if (userLoading || !user) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Carregando…</div>;
  }

  const total = score?.total_score ?? 0;
  const pillars = score
    ? [
        { k: "Treino", v: score.workout_score, icon: Dumbbell },
        { k: "Sono", v: score.sleep_score, icon: Moon },
        { k: "Disc.", v: score.discipline_score, icon: Apple },
        { k: "Água", v: score.water_score, icon: Droplets },
        { k: "Humor", v: score.mood_score, icon: Smile },
      ]
    : null;

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-neon/10 blur-3xl" />
      </div>

      <div className="relative px-5 pt-12">
        {/* Header */}
        <div className="flex items-center justify-between fade-up">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full border border-neon/40 bg-surface-elevated text-xs font-bold uppercase">
              {userName.substring(0, 2)}
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{getGreeting()}</p>
              <h1 className="font-display text-lg font-bold leading-tight">{userName} <span className="text-neon">⚡</span></h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleLogout} aria-label="Sair" className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface text-muted-foreground hover:text-destructive transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
            <Link to="/app/notificacoes" aria-label="Notificações" className="relative grid h-10 w-10 place-items-center rounded-full border border-border bg-surface">
              <Bell className="h-4 w-4" />
              {hasUnreadNotif && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-neon glow-neon" />}
            </Link>
          </div>
        </div>

        {/* Score */}
        <section className="relative mt-6 overflow-hidden rounded-[28px] border border-neon/25 bg-surface p-6 fade-up">
          <div className="pointer-events-none absolute -top-24 -right-20 h-64 w-64 rounded-full bg-neon/25 blur-3xl" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-neon">SHUB SCORE</p>
              <p className="mt-1 text-xs text-muted-foreground">Performance humana hoje</p>
            </div>
            {streak && streak.current_streak > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full border border-neon/40 bg-neon/10 px-2.5 py-1 text-[10px] font-semibold text-neon">
                <Flame className="h-3 w-3" /> {streak.current_streak}d
              </span>
            )}
          </div>
          <div className="relative mt-4 flex items-center justify-center">
            <ScoreRing value={total} size={210} stroke={14} />
          </div>
          <div className="relative mt-5 grid grid-cols-3 gap-3">
            <Mini label="Hoje" value={String(total)} />
            <Mini label="Streak" value={streak ? `${streak.current_streak}d` : "—"} />
            <Mini label="Recorde" value={streak ? `${streak.best_streak}d` : "—"} />
          </div>
        </section>

        {/* Pillars */}
        {pillars ? (
          <div className="mt-5 rounded-3xl border border-border bg-surface p-4 fade-up">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Pilares</p>
              <span className="text-[10px] text-neon">total {total}</span>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {pillars.map(({ k, v, icon: Icon }) => (
                <div key={k} className="flex flex-col items-center gap-2">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-surface-elevated text-neon">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="h-16 w-1.5 overflow-hidden rounded-full bg-surface-elevated">
                    <div
                      className="mt-auto h-full w-full origin-bottom bg-neon glow-neon"
                      style={{ transform: `scaleY(${Math.max(0, Math.min(1, v / 100))})`, transition: "transform 1.2s ease-out" }}
                    />
                  </div>
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground">{k}</p>
                  <p className="-mt-1 font-display text-[11px] font-bold">{v}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-5">
            <EmptyState icon={Sparkles} title="Sem score ainda" description="Registre água, humor, treino e sono para começar a calcular seu SHUB SCORE de hoje." />
          </div>
        )}

        {/* Training */}
        <Section title="Treino do dia" action={<Link to="/app/treinos" className="text-xs text-neon">Ver plano</Link>}>
          {nextWorkout ? (
            <div className="relative overflow-hidden rounded-3xl border border-neon/30 bg-surface">
              <div className="pointer-events-none absolute -top-14 -right-10 h-48 w-48 rounded-full bg-neon/20 blur-3xl" />
              <div className="relative p-5">
                <div className="flex items-center justify-between">
                  {nextWorkout.category && (
                    <span className="rounded-full border border-neon/40 bg-neon/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-neon">
                      {nextWorkout.category}
                    </span>
                  )}
                </div>
                <h3 className="mt-3 font-display text-2xl font-bold leading-tight">{nextWorkout.title}</h3>
                <div className="mt-4 flex items-center gap-4 text-[11px]">
                  {nextWorkout.duration_minutes != null && <Pill label={`${nextWorkout.duration_minutes} min`} />}
                  {nextWorkout.estimated_calories != null && <Pill label={`${nextWorkout.estimated_calories} kcal`} />}
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <Link to="/app/treinos/$id" params={{ id: nextWorkout.id }} className="inline-flex items-center gap-2 rounded-full bg-neon px-5 py-3 text-xs font-semibold text-neon-foreground glow-neon active:scale-95 transition">
                    <Play className="h-3.5 w-3.5 fill-current" /> Iniciar treino
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState icon={Dumbbell} title="Sem treino programado" description="Quando seu personal liberar a programação, o próximo treino aparecerá aqui." />
          )}
        </Section>

        {/* Mood + Water */}
        <div className="mt-7 grid grid-cols-2 gap-3 fade-up">
          <Card>
            <CardHeader icon={Smile} label="Humor" />
            <p className="mt-2 font-display text-base font-bold">
              {lastMood ? ["😴", "😐", "🙂", "🔥", "🚀"][Math.max(0, Math.min(4, lastMood.mood - 1))] + " registrado" : "Como está hoje?"}
            </p>
            <div className="mt-3 flex items-center justify-between">
              {["😴", "😐", "🙂", "🔥", "🚀"].map((m, i) => (
                <button
                  key={i}
                  onClick={() => logMood.mutate(i + 1)}
                  disabled={logMood.isPending}
                  className="grid h-8 w-8 place-items-center rounded-full bg-surface-elevated text-base transition hover:bg-neon/20 active:scale-95"
                  aria-label={`Humor ${i + 1}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader icon={Droplets} label="Hidratação" trailing={<span className="text-[10px] text-neon">{Math.round((waterMl / WATER_GOAL_ML) * 100)}%</span>} />
            <div className="mt-2 flex items-baseline gap-1">
              <p className="font-display text-2xl font-bold">{(waterMl / 1000).toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">/ {(WATER_GOAL_ML / 1000).toFixed(1)} L</p>
            </div>
            <div className="relative mt-3 h-16 overflow-hidden rounded-2xl border border-border bg-surface-elevated">
              <div
                className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-neon to-neon/40"
                style={{ height: `${Math.min(100, (waterMl / WATER_GOAL_ML) * 100)}%`, transition: "height 1.2s ease-out", boxShadow: "0 0 30px var(--neon)" }}
              />
              <div className="absolute inset-0 grid place-items-center">
                <button
                  onClick={() => addWater.mutate(250)}
                  disabled={addWater.isPending}
                  className="inline-flex items-center gap-1 rounded-full bg-background/70 px-3 py-1 text-[10px] font-semibold text-neon backdrop-blur disabled:opacity-50"
                >
                  <Plus className="h-3 w-3" /> 250 ml
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sleep */}
        <Section title="Qualidade do sono">
          {sleep && sleep.total_minutes ? (
            <Card className="!p-5">
              <div className="flex items-end justify-between">
                <div>
                  <CardHeader icon={Moon} label="Última noite" />
                  <p className="mt-2 font-display text-3xl font-bold">
                    {Math.floor(sleep.total_minutes / 60)}h {String(sleep.total_minutes % 60).padStart(2, "0")}m
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {sleep.deep_sleep_minutes != null && `deep ${sleep.deep_sleep_minutes}m`}
                    {sleep.rem_sleep_minutes != null && ` · rem ${sleep.rem_sleep_minutes}m`}
                  </p>
                </div>
                {sleep.score != null && (
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Score</p>
                    <p className="font-display text-2xl font-bold text-neon">{sleep.score}</p>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <EmptyState icon={Moon} title="Sem registro de sono" description="Conecte um wearable ou registre manualmente para ver a análise da última noite." />
          )}
        </Section>

        {/* Weekly */}
        <Section title="Evolução semanal" action={<Link to="/app/evolucao" className="text-xs text-neon">Ver mais</Link>}>
          {weekScores.length === 0 ? (
            <EmptyState icon={Trophy} title="Sem histórico" description="Sua evolução semanal aparece após o primeiro score registrado." />
          ) : (
            <Card className="!p-5">
              <div className="relative flex h-32 items-end gap-2">
                {weekScores.map((d, i) => {
                  const max = Math.max(...weekScores.map((s) => s.total_score), 1);
                  const isToday = i === weekScores.length - 1;
                  return (
                    <div key={d.score_date} className="flex flex-1 flex-col items-center gap-2">
                      <div className="flex w-full flex-1 items-end">
                        <div
                          className={`w-full rounded-t-lg ${isToday ? "bg-neon glow-neon" : "bg-neon/30"}`}
                          style={{ height: `${(d.total_score / max) * 100}%`, transition: "height 1s ease-out" }}
                        />
                      </div>
                      <span className={`text-[10px] ${isToday ? "font-bold text-neon" : "text-muted-foreground"}`}>
                        {new Date(d.score_date).toLocaleDateString("pt-BR", { weekday: "narrow" })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </Section>

        <p className="mb-6 mt-10 text-center text-[10px] tracking-[0.4em] text-muted-foreground">
          SHUB LIFE · MUITO ALÉM DO TREINO
        </p>
      </div>
    </div>
  );
}

/* ───────── primitives ───────── */

function ScoreRing({ value, size = 200, stroke = 12 }: { value: number; size?: number; stroke?: number }) {
  const [v, setV] = useState(0);
  useEffect(() => { const t = setTimeout(() => setV(value), 80); return () => clearTimeout(t); }, [value]);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (v / 100) * c;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="ringGradHome" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.93 0.27 130)" />
            <stop offset="100%" stopColor="oklch(0.85 0.25 145)" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--surface-elevated)" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke="url(#ringGradHome)" strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.6s cubic-bezier(.22,1,.36,1)", filter: "drop-shadow(0 0 10px var(--neon))" }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">SHUB</p>
        <p className="font-display text-6xl font-bold leading-none">{v}</p>
        <p className="mt-1 text-[10px] text-muted-foreground">de 100</p>
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-elevated/60 p-3 text-center">
      <p className="text-[9px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-sm font-bold text-neon">{value}</p>
    </div>
  );
}

function Pill({ label }: { label: string }) {
  return <span className="rounded-full border border-border bg-surface-elevated px-2.5 py-1 text-muted-foreground">{label}</span>;
}

function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mt-7 fade-up">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-base font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-3xl border border-border bg-surface p-4 ${className}`}>{children}</div>;
}

function CardHeader({ icon: Icon, label, trailing }: { icon: React.ComponentType<{ className?: string }>; label: string; trailing?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="grid h-7 w-7 place-items-center rounded-lg bg-surface-elevated text-neon">
          <Icon className="h-3.5 w-3.5" />
        </div>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      </div>
      {trailing}
    </div>
  );
}
