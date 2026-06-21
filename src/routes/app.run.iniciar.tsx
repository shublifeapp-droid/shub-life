import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Pause, Play, Square, Loader2, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  type GpsPoint,
  type RunActivityType,
  avgSpeed,
  estimateCalories,
  formatDuration,
  formatPace,
  pace,
  scoreDeltaForRun,
  toSvgPolyline,
  totalDistanceKm,
  xpForRun,
} from "@/lib/shub/running";

export const Route = createFileRoute("/app/run/iniciar")({
  component: StartActivityPage,
});

type Stage = "config" | "tracking" | "paused" | "summary";

function StartActivityPage() {
  const navigate = useNavigate();
  const { user } = useCurrentUser();

  const [stage, setStage] = useState<Stage>("config");
  const [type, setType] = useState<RunActivityType>("run");
  const [goalKm, setGoalKm] = useState<string>("");

  const [points, setPoints] = useState<GpsPoint[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const watchIdRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const startedAtRef = useRef<number>(0);
  const activityIdRef = useRef<string | null>(null);

  // keep screen awake
  useEffect(() => {
    if (stage !== "tracking") return;
    let lock: WakeLockSentinel | null = null;
    const nav = navigator as Navigator & {
      wakeLock?: { request: (type: "screen") => Promise<WakeLockSentinel> };
    };
    nav.wakeLock?.request("screen").then((l) => (lock = l)).catch(() => undefined);
    return () => {
      lock?.release().catch(() => undefined);
    };
  }, [stage]);

  // timer
  useEffect(() => {
    if (stage !== "tracking") return;
    const tick = () => setElapsed(Math.floor((Date.now() - startedAtRef.current) / 1000));
    timerRef.current = window.setInterval(tick, 1000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [stage]);

  // geolocation watch
  useEffect(() => {
    if (stage !== "tracking") return;
    if (!("geolocation" in navigator)) {
      setError("Geolocalização indisponível neste dispositivo.");
      return;
    }
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setPoints((prev) => [
          ...prev,
          {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            recorded_at: new Date().toISOString(),
          },
        ]);
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 },
    );
    watchIdRef.current = id;
    return () => {
      navigator.geolocation.clearWatch(id);
      watchIdRef.current = null;
    };
  }, [stage]);

  const distanceKm = totalDistanceKm(points);
  const p = pace(distanceKm, elapsed);
  const speed = avgSpeed(distanceKm, elapsed);
  const cal = estimateCalories(type, elapsed);

  function start() {
    setError(null);
    setPoints([]);
    setElapsed(0);
    startedAtRef.current = Date.now();
    activityIdRef.current = null;
    setStage("tracking");
  }

  function pause() {
    if (timerRef.current) window.clearInterval(timerRef.current);
    if (watchIdRef.current != null) navigator.geolocation.clearWatch(watchIdRef.current);
    setStage("paused");
  }

  function resume() {
    startedAtRef.current = Date.now() - elapsed * 1000;
    setStage("tracking");
  }

  async function finish() {
    if (timerRef.current) window.clearInterval(timerRef.current);
    if (watchIdRef.current != null) navigator.geolocation.clearWatch(watchIdRef.current);

    if (!user) {
      setStage("summary");
      return;
    }
    setSaving(true);
    const startIso = new Date(startedAtRef.current).toISOString();
    const endIso = new Date().toISOString();
    const xp = xpForRun(distanceKm);
    const scoreDelta = scoreDeltaForRun(distanceKm);
    const { data: act, error: insErr } = await supabase
      .from("running_activities")
      .insert({
        user_id: user.id,
        activity_type: type,
        start_time: startIso,
        end_time: endIso,
        duration_seconds: elapsed,
        distance_km: Number(distanceKm.toFixed(3)),
        avg_pace: p,
        avg_speed: Number(speed.toFixed(2)),
        calories: cal,
        route_polyline: toSvgPolyline(points),
        xp_earned: xp,
        shub_score_delta: scoreDelta,
      })
      .select("id")
      .single();

    if (!insErr && act && points.length > 0) {
      activityIdRef.current = act.id;
      await supabase.from("gps_points").insert(
        points.map((pt) => ({
          activity_id: act.id,
          user_id: user.id,
          latitude: pt.latitude,
          longitude: pt.longitude,
          recorded_at: pt.recorded_at,
        })),
      );
    }
    setSaving(false);
    setStage("summary");
  }

  if (stage === "config") {
    return (
      <div className="px-5 pt-12 pb-10">
        <p className="text-[10px] uppercase tracking-[0.3em] text-neon">SHUB RUN</p>
        <h1 className="mt-1 font-display text-3xl font-bold">Nova atividade</h1>

        <div className="mt-6 space-y-2">
          {(
            [
              { v: "run", label: "Corrida" },
              { v: "walk", label: "Caminhada" },
              { v: "free", label: "Corrida livre" },
              { v: "challenge", label: "Desafio" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.v}
              onClick={() => setType(opt.v)}
              className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                type === opt.v
                  ? "border-neon bg-neon/10 text-neon"
                  : "border-border bg-surface text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          <label className="text-xs uppercase tracking-wider text-muted-foreground">
            Meta de distância (opcional)
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={goalKm}
            onChange={(e) => setGoalKm(e.target.value)}
            placeholder="km"
            className="mt-2 w-full rounded-2xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-neon focus:outline-none"
          />
        </div>

        <button
          onClick={start}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-neon px-6 py-4 font-semibold text-neon-foreground glow-neon active:scale-95 transition-transform"
        >
          <Play className="h-5 w-5" strokeWidth={2.5} />
          Iniciar atividade
        </button>
      </div>
    );
  }

  if (stage === "summary") {
    return (
      <div className="px-5 pt-12 pb-10">
        <p className="text-[10px] uppercase tracking-[0.3em] text-neon">RESUMO</p>
        <h1 className="mt-1 font-display text-3xl font-bold">Atividade concluída</h1>

        <RouteMini points={points} />

        <section className="mt-6 grid grid-cols-2 gap-3">
          <Stat label="Distância" value={`${distanceKm.toFixed(2)} km`} />
          <Stat label="Tempo" value={formatDuration(elapsed)} />
          <Stat label="Pace médio" value={formatPace(p)} />
          <Stat label="Velocidade" value={`${speed.toFixed(1)} km/h`} />
          <Stat label="Calorias" value={`${cal} kcal`} />
          <Stat label="XP ganho" value={`+${xpForRun(distanceKm)}`} />
        </section>

        <div className="mt-6 card-premium p-4">
          <p className="text-xs text-muted-foreground">SHUB SCORE</p>
          <p className="mt-1 font-display text-xl font-semibold text-neon">
            +{scoreDeltaForRun(distanceKm)} pontos
          </p>
        </div>

        <button
          onClick={() => navigate({ to: "/app/run" })}
          className="mt-6 w-full rounded-full bg-neon px-6 py-4 font-semibold text-neon-foreground glow-neon active:scale-95 transition-transform"
        >
          Concluir
        </button>
      </div>
    );
  }

  // tracking / paused
  return (
    <div className="px-5 pt-12 pb-10">
      <p className="text-[10px] uppercase tracking-[0.3em] text-neon">
        {stage === "paused" ? "PAUSADO" : "EM ATIVIDADE"}
      </p>
      <h1 className="mt-1 font-display text-5xl font-bold tabular-nums">
        {formatDuration(elapsed)}
      </h1>

      <RouteMini points={points} />

      {error && (
        <div className="mt-4 rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-xs text-destructive">
          <MapPin className="mr-2 inline h-3 w-3" /> {error}
        </div>
      )}

      <section className="mt-6 grid grid-cols-2 gap-3">
        <Stat label="Distância" value={`${distanceKm.toFixed(2)} km`} />
        <Stat label="Pace" value={formatPace(p)} />
        <Stat label="Velocidade" value={`${speed.toFixed(1)} km/h`} />
        <Stat label="Calorias" value={`${cal} kcal`} />
      </section>

      <div className="mt-8 flex gap-3">
        {stage === "tracking" ? (
          <button
            onClick={pause}
            className="flex-1 rounded-full bg-surface border border-border px-6 py-4 font-semibold text-foreground active:scale-95 transition-transform inline-flex items-center justify-center gap-2"
          >
            <Pause className="h-5 w-5" /> Pausar
          </button>
        ) : (
          <button
            onClick={resume}
            className="flex-1 rounded-full bg-neon px-6 py-4 font-semibold text-neon-foreground glow-neon active:scale-95 transition-transform inline-flex items-center justify-center gap-2"
          >
            <Play className="h-5 w-5" /> Retomar
          </button>
        )}
        <button
          onClick={finish}
          disabled={saving}
          className="flex-1 rounded-full bg-destructive px-6 py-4 font-semibold text-destructive-foreground active:scale-95 transition-transform inline-flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Square className="h-5 w-5" />}
          Finalizar
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-premium p-4">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function RouteMini({ points }: { points: GpsPoint[] }) {
  const poly = toSvgPolyline(points, 100);
  return (
    <div className="mt-6 aspect-video w-full overflow-hidden rounded-3xl border border-border bg-surface relative">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--neon)/.15),transparent_60%)]" />
      {poly ? (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
          <polyline
            points={poly}
            fill="none"
            stroke="hsl(var(--neon))"
            strokeWidth="1.2"
            strokeLinejoin="round"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 2px hsl(var(--neon)))" }}
          />
        </svg>
      ) : (
        <div className="grid h-full w-full place-items-center text-xs text-muted-foreground">
          Capturando GPS...
        </div>
      )}
    </div>
  );
}
